const data = require('./data/coba.json');
const fs = require('fs');

const inputData = data;

function transformData(data, kelas) {
    const result = [];

    // Group by `nama_tarif`
    const groupedData = data.reduce((acc, item) => {
        const key = item.nama_tarif;
        if (!acc[key]) {
            acc[key] = {
                unit: [item.unit],
                tarif_detail: [],
                nama: key,
                unit_value: item.unit,
                tahun: item.tahun,
                komponen_tarif: []
            };
        }

        // Create a new tarif_detail entry
        const tarifDetail = {
            id: 0,
            tarif_pelayanan_id: "0",
            tahun: item.tahun,
            cara_bayar_id: "1",
            perusahaan_id: 0,
            kelas_id: item.komponen_key.trim() === "P." ? item.komponen_id : 0,
            golongan_operasi: 0,
            biaya: 0,
            tarif: item[item.komponen_key.trim() + item.komponen_id],
            komponen_list: []
        };

        // Add komponen to komponen_list
        tarifDetail.komponen_list.push({
            id: 0,
            tarif_pelayanan_detail_id: 0,
            komponen_id: item.komponen_id,
            komponen: item.komponen_nama,
            komponen_jenis: item.komponen_jenis,
            tarif: item[`kelas_${kelas}`], // Get the tarif based on the specified kelas
            biaya: 0
        });

        // Add tarif_detail to the group
        acc[key].tarif_detail.push(tarifDetail);

        // Add to komponen_tarif if not already present
        if (!acc[key].komponen_tarif.some(comp => comp.id === item.komponen_id)) {
            acc[key].komponen_tarif.push({
                id: item.komponen_id,
                nama: item.komponen_nama,
                jenis: item.komponen_jenis
            });
        }

        return acc;
    }, {});

    // Convert grouped data to array
    for (const key in groupedData) {
        const group = groupedData[key];

        // Ensure each tarif_detail has exactly 3 components
        group.tarif_detail.forEach(detail => {
            // Fill komponen_list with up to 3 components
            while (detail.komponen_list.length < 3) {
                const additionalComponent = group.komponen_tarif[detail.komponen_list.length % group.komponen_tarif.length];
                if (additionalComponent) {
                    // Find the corresponding item for the additional component
                    const correspondingItem = data.find(item => item.komponen_id === additionalComponent.id && item.nama_tarif === group.nama);
                    if (correspondingItem) {
                        detail.komponen_list.push({
                            id: 0,
                            tarif_pelayanan_detail_id: 0,
                            komponen_id: additionalComponent.id,
                            komponen: additionalComponent.nama,
                            komponen_jenis: additionalComponent.jenis,
                            tarif: correspondingItem[`kelas_${kelas}`], // Get the tarif based on the specified kelas
                            biaya: 0
                        });
                    }
                }
            }
        });

        result.push(group);
    }

    return result;
}

// Call the function with the desired kelas (e.g., 12)
const transformedData = transformData(inputData, 12);
console.log(JSON.stringify(transformedData, null, 2));