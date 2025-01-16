const data = require('./data/tarif_ok.json');

const filteredData = data.filter(item => item.no !== "");
const uniqueData = Array.from(new Map(filteredData.map(item => [item.no, item])).values());

let parent = [];
uniqueData.forEach(item => {
    let dataParent = {
        unit: [item.unit],
        nama: item.nama_tarif,
        unit_value: item.unit,
        icd_9_value: { "0": null },
        jenis_kegiatan_value: "",
        jenis_kegiatan: "",
        id: 0,
        uid: 0,
        kelas: 1,
        bedah: "1",
        status: "1",
        tarif_detail: [],
        komponen_tarif: []
    };

    parent.push(dataParent);
});

data.forEach(item => {
    let tarifDetail = {
        id: 0,
        tarif_pelayanan_id: 0,
        tahun: item.tahun,
        cara_bayar_id: "1",
        perusahaan_id: 0,
        kelas_id: 1,
        golongan_operasi: 0,
        biaya: 0,
        tarif: 0,
        komponen_list: []
    };

    // Menghitung jumlah kelas
    let jumlahKelas = Object.keys(item).filter(key => key.startsWith('kelas_')).length;

    for (let i = 1; i <= jumlahKelas; i++) {
        let tarif = item[`kelas_${i}`];

        console.log(tarif)

        // Membuat komponen list
        let komponenList = {
            id: 0,
            tarif_pelayanan_detail_id: 0,
            komponen_id: item.komponen_id.toString(), // Pastikan ini diambil dengan benar
            komponen: `${item.komponen_key}. ${item.komponen_nama}`,
            komponen_jenis: item.komponen_jenis.toString(), // Pastikan ini diambil dengan benar
            tarif: tarif,
            biaya: 0
        };

        // Menambahkan komponen list ke tarifDetail
        tarifDetail.komponen_list.push(komponenList);
    }

    // Mencari parent berdasarkan nama tarif
    let foundParent = parent.find(p => p.nama === item.nama_tarif);
    if (foundParent) {
        foundParent.tarif_detail.push(tarifDetail);
    }

    console.log(tarifDetail)
});