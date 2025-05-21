const path = require('path');
const env = require('./env');
const data = require(`./data/${env.DIR}/${env.FILE_INPUT}.json`);
const fs = require('fs');

const fileName = env.FILE_INPUT;
const structuredData = data.reduce((acc, item) => {
    const { nama_tarif, id_bedah, tahun, ...child } = item;
    const key = `${nama_tarif}-${id_bedah}-${tahun}`;

    if (!acc[key]) {
        acc[key] = {
            no: item.no || null,
            nama_tarif,
            id_bedah,
            tahun,
            unit: item.unit,
            kelas: [],
            komponen: [],
            tarif: []
        };
    }

    Object.keys(item).forEach(k => {
        if (k.startsWith('kelas_')) {
            const kelasNumber = parseInt(k.split('_')[1], 10);
            if (!acc[key].kelas.includes(kelasNumber)) {
                acc[key].kelas.push(kelasNumber);
            }
        }
    });

    acc[key].komponen.push({
        komponen_jenis: child.komponen_jenis,
        komponen_key: child.komponen_key,
        komponen_nama: child.komponen_nama,
        komponen_id: child.komponen_id,
        unit: child.unit
    });

    Object.keys(item).forEach(k => {
        if (k.startsWith('kelas_')) {
            const kelasNumber = parseInt(k.split('_')[1], 10);
            const tarifValue = item[k];

            let kelasEntry = acc[key].tarif.find(t => t.kelas === kelasNumber);
            if (!kelasEntry) {
                kelasEntry = { kelas: kelasNumber, komponen: [] };
                acc[key].tarif.push(kelasEntry);
            }

            kelasEntry.komponen.push({
                id: child.komponen_id,
                komponen: `${child.komponen_key}${child.komponen_nama}`,
                jenis: child.komponen_jenis,
                tarif: tarifValue
            });
        }
    });

    return acc;
}, {});

const result = Object.values(structuredData);
// console.log(JSON.stringify(result, null, 2)); return;

const results = result; // Assuming 'result' is the array of data inputs
const dataParents = []; // Array to hold all dataParent objects
results.forEach(dataInput => {
    let unitArray = dataInput.unit.split(',').map(Number);
    const dataParent = {
        unit: unitArray,
        tarif_detail: [],
        nama: `${dataInput.nama_tarif} (2025)`,
        unit_value: dataInput.unit,
        icd_9_value: "",
        jenis_kegiatan_value: "",
        jenis_kegiatan: "",
        id: 0,
        uid: 0,
        kelas: 1,
        // bedah: dataInput.id_bedah == 0 ? 0 : 1,
        bedah: (dataInput.id_bedah > 0) ? dataInput.id_bedah : 0,
        status: 0,
        komponen_tarif: []
    };

    dataInput.komponen.forEach(komponen => {
        const komponenEntry = {
            id: komponen.komponen_id,
            nama: `${komponen.komponen_key} ${komponen.komponen_nama}`,
            jenis: komponen.komponen_jenis
        };
        if (!dataParent.komponen_tarif.some(k => k.id === komponenEntry.id)) {
            dataParent.komponen_tarif.push(komponenEntry);
        }
    });

    let tarifDetail = [];
    dataInput.kelas.forEach(item => {
        const tarifDetailItem = {
            id: 0,
            tarif_pelayanan_id: "0",
            tahun: dataInput.tahun ?? "2025",
            // cara_bayar_id: "3",
            cara_bayar_id: env.CARA_BAYAR_ID ?? "3",
            perusahaan_id: 0,
            kelas_id: item,
            golongan_operasi: dataInput.id_bedah ?? 0,
            biaya: 0,
            tarif: 0,
            komponen_list: []
        };

        dataInput.tarif.forEach(tarif => {
            if (tarif.kelas === item) {
                // tarifDetailItem.tarif = tarif.komponen[0].tarif;
                tarif.komponen.forEach(komponen => {
                    tarifDetailItem.komponen_list.push({
                        id: 0,
                        tarif_pelayanan_detail_id: 0,
                        komponen_id: komponen.id,
                        komponen: komponen.komponen,
                        komponen_jenis: komponen.jenis,
                        tarif: komponen.tarif,
                        biaya: 0
                    });
                });
            }
        });

        tarifDetail.push(tarifDetailItem);
    });

    dataParent.tarif_detail = tarifDetail;
    dataParents.push(dataParent);
});

const jsonFilePath = `./output/${env.DIR}/${fileName}_output.json`;
const dir = path.dirname(jsonFilePath);
fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
        console.error('Error creating directory', err);
        return;
    }

    fs.writeFile(jsonFilePath, JSON.stringify(dataParents, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data successfully saved to', jsonFilePath);
        }
    });
});