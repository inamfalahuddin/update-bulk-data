const data = require('./data/tarif_ok.json');
const fs = require('fs');

const filteredData = data.filter(item => item.no !== "");
const uniqueData = Array.from(new Map(filteredData.map(item => [item.no, item])).values());

// let parent = [];
// uniqueData.forEach(item => {
//     let dataParent = {
//         no: item.no,
//         nama_tarif: item.nama_tarif,
//         id_bedah: item.id_bedah,
//         tahun: item.tahun,
//         unit: item.unit,
//         children: []
//     };

//     parent.push(dataParent);
// });

let parent = [];

data.forEach(item => {
    // Cek apakah parent dengan nama_tarif sudah ada
    let foundParent = parent.find(p => p.nama_tarif === item.nama_tarif);

    if (!foundParent) {
        // Jika belum ada, buat parent baru
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

    // Tambahkan item ke children
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

// console.log(JSON.stringify(parent, null, 2));
// console.log(JSON.stringify(parent[0], null, 2));
// Mengonversi data dan mencetak hasilnya
// const result = convertData(parent);
// console.log(JSON.stringify(result[0], null, 4));

let parentResult = [];
parent.forEach(item => {
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

    const countKelas = Object.keys(item.children[0]).filter(key => key.startsWith('kelas_')).length;

    
    item.children.forEach(child => {
        let tarifDetail = {
            id: 0,
            tarif_pelayanan_id: 0,
            tahun: item.tahun,
            cara_bayar_id: "1",
            perusahaan_id: 0,
            kelas_id: 0,
            golongan_operasi: 0,
            biaya: 0,
            tarif: 0,
            komponen_list: []
        };

        for (let i = 1; i <= countKelas; i++) {
            let tarif = child[`kelas_${i}`];

            let komponenList = {
                id: 0,
                tarif_pelayanan_detail_id: 0,
                komponen_id: child.komponen_id.toString(),
                komponen: `${child.komponen_key}. ${child.komponen_nama}`,
                komponen_jenis: child.komponen_jenis.toString(),
                tarif: tarif,
                biaya: 0
            };

            tarifDetail.komponen_list.push(komponenList);
        }
        
        dataParent.tarif_detail.push(tarifDetail);
    });

    parentResult.push(dataParent);
});

// console.log(JSON.stringify(parentResult[0], null, 2)); return;


// console.log(JSON.stringify(parent.slice(0, 2), null, 4));
// console.log(JSON.stringify(result, null, 2));
const jsonFilePath = './output.json';

fs.writeFile(jsonFilePath, JSON.stringify(parentResult, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Data successfully saved to', jsonFilePath);
    }
});