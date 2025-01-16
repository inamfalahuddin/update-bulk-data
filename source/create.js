const data = require('./data/coba.json');
const fs = require('fs');

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
// parent.forEach(item => {
//     let dataParent = {
//         unit: [item.unit],
//         nama: item.nama_tarif,
//         unit_value: item.unit,
//         icd_9_value: { "0": null },
//         jenis_kegiatan_value: "",
//         jenis_kegiatan: "",
//         id: 0,
//         uid: 0,
//         kelas: 0,
//         bedah: "0",
//         status: "0",
//         tarif_detail: [],
//         komponen_tarif: []
//     };

//     item.children.forEach(child => {
//         const kelasKeys = Object.keys(child).filter(key => key.startsWith('kelas_'));

//         kelasKeys.forEach(kelasKey => {
//             const tarif = child[kelasKey];
//             const kelasNumber = kelasKey.replace('kelas_', '');

//             let tarifDetail = {
//                 id: 0,
//                 tarif_pelayanan_id: 0,
//                 tahun: item.tahun,
//                 cara_bayar_id: "1",
//                 perusahaan_id: 0,
//                 kelas_id: kelasNumber,
//                 golongan_operasi: 0,
//                 biaya: 0,
//                 tarif: 0,
//                 komponen_list: []
//             };

//             parent.forEach(komponen => {
//                 let komponenList = {
//                     id: 0,
//                     tarif_pelayanan_detail_id: 0,
//                     komponen_id: komponen.komponen_id.toString(), // Mengambil komponen_id dari komponen
//                     komponen: `${komponen.komponen_key}. ${komponen.komponen_nama}`, // Mengambil komponen dari komponen
//                     komponen_jenis: komponen.komponen_jenis.toString(), // Mengambil komponen_jenis dari komponen
//                     tarif: tarif, // Menggunakan tarif yang sesuai
//                     biaya: 0
//                 };

//                 // Menambahkan komponenList ke dalam komponen_list di tarifDetail
//                 tarifDetail.komponen_list.push(komponenList);
//             });

//             dataParent.tarif_detail.push(tarifDetail);
//         });
//     });

//     parentResult.push(dataParent); // Menambahkan dataParent ke parentResult
// });

// Menampilkan hasil

data.forEach(item => {
    let dataParent = {
        unit: [item.unit],
        nama: item.nama_tarif,
        unit_value: item.unit,
        icd_9_value: { "0": null },
        jenis_kegiatan_value: "",
        jenis_kegiatan: "",
        id: 0,
        uid: 0,
        kelas: 0,
        bedah: "0",
        status: "0",
        tarif_detail: [],
        komponen_tarif: []
    };

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
                golongan_operasi: 0,
                biaya: 0,
                tarif: tarif, // Menggunakan tarif yang sesuai
                komponen_list: [] // Inisialisasi komponen_list
            };

            // Mengambil komponen dari komponenData
            komponenData.forEach(komponen => {
                let komponenList = {
                    id: 0,
                    tarif_pelayanan_detail_id: 0,
                    komponen_id: komponen.komponen_id.toString(), // Mengambil komponen_id dari komponen
                    komponen: `${komponen.komponen_key}. ${komponen.komponen_nama}`, // Mengambil komponen dari komponen
                    komponen_jenis: komponen.komponen_jenis.toString(), // Mengambil komponen_jenis dari komponen
                    tarif: tarif, // Menggunakan tarif yang sesuai
                    biaya: 0
                };

                // Menambahkan komponenList ke dalam komponen_list di tarifDetail
                tarifDetail.komponen_list.push(komponenList);
            });

            // Menambahkan tarifDetail ke dataParent
            dataParent.tarif_detail.push(tarifDetail);
        });
    });

    parentResult.push(dataParent); // Menambahkan dataParent ke parentResult
});

console.log(JSON.stringify(parentResult, null, 2));


// console.log(JSON.stringify(parentResult[0], null, 2)); return;
// const jsonFilePath = './output.json';
// fs.writeFile(jsonFilePath, JSON.stringify(parentResult, null, 2), 'utf8', (err) => {
//     if (err) {
//         console.error('Error writing to file', err);
//     } else {
//         console.log('Data successfully saved to', jsonFilePath);
//     }
// });