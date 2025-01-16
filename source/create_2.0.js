const fs = require('fs');
const path = require('path'); // Import path module for handling file paths
const data = require('./data/tarif_ok.json');

// Filter out items with no value
const filteredData = data.filter(item => item.no !== "");

// Create unique data based on 'nama_tarif'
const uniqueData = Array.from(new Map(filteredData.map(item => [item.nama_tarif, item])).values());

let parent = uniqueData.map(item => {
    return {
        unit: [item.unit],
        tarif_detail: [],
        nama: item.nama_tarif,
        unit_value: item.unit,
        icd_9_value: "", // Assuming this is empty as per your example
        jenis_kegiatan_value: "", // Assuming this is empty as per your example
        jenis_kegiatan: "", // Assuming this is empty as per your example
        id: 0,
        uid: 0,
        kelas: 1, // Assuming a default value for kelas
        bedah: 0, // Assuming a default value for bedah
        status: 0, // Assuming a default value for status
        komponen_tarif: []
    };
});

// Process each item to create tarif_detail and komponen_tarif
data.forEach(item => {
    let tarifDetail = {
        id: 0,
        tarif_pelayanan_id: "0", // Assuming this is a string as per your example
        tahun: item.tahun,
        cara_bayar_id: "1",
        perusahaan_id: 0,
        kelas_id: 0,
        golongan_operasi: 0,
        biaya: 0,
        tarif: 0,
        komponen_list: []
    };

    // Count the number of kelas
    let jumlahKelas = Object.keys(item).filter(key => key.startsWith('kelas_')).length;

    for (let i = 1; i <= jumlahKelas; i++) {
        let tarif = item[`kelas_${i}`];

        // Create komponen list
        let komponenList = {
            id: 0,
            tarif_pelayanan_detail_id: 0,
            komponen_id: item.komponen_id.toString(),
            komponen: `${item.komponen_key} ${item.komponen_nama}`,
            komponen_jenis: item.komponen_jenis.toString(),
            tarif: tarif,
            biaya: 0
        };

        // Add komponen list to tarifDetail
        tarifDetail.komponen_list.push(komponenList);
    }

    // Find parent based on nama tarif
    let foundParent = parent.find(p => p.nama === item.nama_tarif);
    if (foundParent) {
        foundParent.tarif_detail.push(tarifDetail);

        // Add komponen_tarif if not already present
        let komponenTarif = {
            id: item.komponen_id,
            nama: item.komponen_nama,
            jenis: item.komponen_jenis
        };

        // Check if komponen_tarif already exists
        if (!foundParent.komponen_tarif.some(k => k.id === komponenTarif.id)) {
            foundParent.komponen_tarif.push(komponenTarif);
        }
    }
});

console.log(data);
return;

// Define the output directory and file path
const outputDir = path.join(__dirname, 'output');
const outputFilePath = path.join(outputDir, 'tarif_output.json');

// Check if the output directory exists, if not, create it
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write the result to a JSON file
fs.writeFile(outputFilePath, JSON.stringify(parent, null, 2), (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Output successfully written to tarif_output.json');
    }
});