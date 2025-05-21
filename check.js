const env = require('./env');
const data = require(`./data/${env.DIR}/${env.FILE_INPUT}.json`);
const fs = require('fs');

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

// console.log(result.length)
const length = result.length;
console.log({
    rows: length,
    file: `./data/${env.DIR}/${env.FILE_INPUT}.json`
})