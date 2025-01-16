const data = require('./data/coba.json');
const fs = require('fs');

const komponenData = data;

let parent = [];
data.forEach(item => {
    let foundParent = parent.find(p => p.nama_tarif === item.nama_tarif);

    if (!foundParent) {
        foundParent = {
            no: item.no,
            nama_tarif: item.nama_tarif,
            id_bedah: item.id_bedah,
            tahun: item.tahun,
            unit: item.unit,
            children: []
        };
        parent.push(foundParent);
    }

    foundParent.children.push({
        komponen_jenis: item.komponen_jenis,
        komponen_key: item.komponen_key,
        komponen_nama: item.komponen_nama,
        komponen_id: item.komponen_id,
        kelas_12: item.kelas_12,
        kelas_8: item.kelas_8,
        kelas_7: item.kelas_7,
        kelas_6: item.kelas_6,
        kelas_5: item.kelas_5,
        kelas_2: item.kelas_2,
        kelas_1: item.kelas_1,
        kelas_11: item.kelas_11,
        kelas_13: item.kelas_13,
        kelas_4: item.kelas_4
    });
});

let parentResult = [];
parent.forEach(item => {
    let dataParent = {
        unit: [item.unit],
        nama: `${item.nama_tarif} (2025)`,
        unit_value: item.unit,
        icd_9_value: { "0": null },
        jenis_kegiatan_value: "",
        jenis_kegiatan: "",
        id: 0,
        uid: 0,
        kelas: 1,
        bedah: 1,
        status: 0,
        tarif_detail: [],
        komponen_tarif: []
    };

    // Mengisi komponen_tarif secara dinamis dari komponenData
    komponenData.forEach(komponen => {
        let komponenTarif = {
            id: komponen.komponen_id.toString(),
            nama: `${komponen.komponen_key} ${komponen.komponen_nama}`,
            jenis: komponen.komponen_jenis.toString()
        };
        dataParent.komponen_tarif.push(komponenTarif);
    });

    item.children.forEach(child => {
        const kelasKeys = Object.keys(child).filter(key => key.startsWith('kelas_'));

        kelasKeys.forEach(kelasKey => {
            const tarif = child[kelasKey];
            const kelasNumber = kelasKey.replace('kelas_', '');

            let tarifDetail = {
                id: 0,
                tarif_pelayanan_id: 0,
                tahun: item.tahun,
                cara_bayar_id: "1",
                perusahaan_id: 0,
                kelas_id: kelasNumber,
                golongan_operasi: item.id_bedah,
                biaya: 0,
                tarif: 0, // Menggunakan tarif yang sesuai
                komponen_list: [] // Inisialisasi komponen_list
            };

            // Menambahkan komponenList ke dalam komponen_list di tarifDetail
            komponenData.forEach(komponen => {
                let komponenList = {
                    id: 0,
                    tarif_pelayanan_detail_id: 0,
                    komponen_id: komponen.komponen_id.toString(),
                    komponen: `${komponen.komponen_key} ${komponen.komponen_nama}`,
                    komponen_jenis: komponen.komponen_jenis.toString(),
                    tarif: komponen[`kelas_${kelasNumber}`], // Menggunakan tarif yang sesuai berdasarkan kelas
                    biaya: 0
                };

                tarifDetail.komponen_list.push(komponenList);
            });

            dataParent.tarif_detail.push(tarifDetail);
        });
    });

    parentResult.push(dataParent);
});

// Hasil akhir parentResult
const jsonFilePath = './output.json';
fs.writeFile(jsonFilePath, JSON.stringify(parentResult, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Data successfully saved to', jsonFilePath);
    }
});