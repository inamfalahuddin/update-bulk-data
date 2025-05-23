const fs = require('fs');
const env = require('./env');
const path = require('path');

const BASE_URL = `${env.HOST}index.php/`;

const API_URI = {
    get: 'api/master/tarif_pelayanan_v2/get_data/:UID',
    get_by_name: 'api/master/tarif_pelayanan_v2/get_by_nama',
    update: 'api/master/tarif_pelayanan_v2/save'
};

// Fungsi untuk mendapatkan data berdasarkan nama
const getDataByName = async (nama) => {
    const url = BASE_URL + API_URI.get_by_name;

    try {
        const response = await fetch(url, {
            method: 'POST', // Specify the method as POST
            headers: {
                'Content-Type': 'application/json',
                headers: {
                    Cookie: env.COOKIE
                }
            },
            body: JSON.stringify({ nama }) // Include the data in the body
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (!data || !data.data) {
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching data by name:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan data berdasarkan UID
const getDataByUID = async (uid) => {
    const url = BASE_URL + API_URI.get.replace(':UID', uid);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (!data || !data.data) {
            return null;
        }

        return data.data; // Mengembalikan detail_list
    } catch (error) {
        console.error('Error fetching data by UID:', error);
        throw error;
    }
};

// Fungsi utama untuk memproses data
const processData = async (data) => {
    const results = [];

    let i = 1;
    for (const item of data) {
        try {
            const fetchedData = await getDataByName(item.nama);

            if (fetchedData == null) {
                console.log(`[${i}] Data not found:`, item.nama);
                continue;
            } else {
                const uid = fetchedData.data;

                if (uid) {
                    const dataByUID = await getDataByUID(uid);

                    let detailList = [];
                    if (dataByUID.detail_list) {
                        detailList = dataByUID.detail_list;
                    }

                    // detailList.push(item.tarif_detail);
                    detailList = [...detailList, ...item.tarif_detail];

                    if(dataByUID.detail_list) {
                        delete dataByUID.detail_list;
                    }

                    if(dataByUID.layanan_list) {
                        delete dataByUID.layanan_list;
                    }

                    // dataByUID.detail_list = detailList;
                    dataByUID.tarif_detail = detailList;
                    dataByUID.komponen_tarif = item.komponen_tarif;
                    dataByUID.unit = item.unit;
                    dataByUID.unit_value = item.unit_value;

                    if (dataByUID.spesialisasi_id || dataByUID.spesialisasi_id == null) {
                        delete dataByUID.spesialisasi_id;
                    }

                    results.push(dataByUID);
                }
                console.log(`[${i}] [UPDATED]`, item.nama);
            }

            i++;
        } catch (error) {
            console.error('Error processing item:', item.nama, error);
        }
    }

    const fileName = env.FILE_INPUT;
    const jsonFilePath = `./output/${env.DIR}/${fileName}_output.json`;
    const dir = path.dirname(jsonFilePath);
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory', err);
            return;
        }

        fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Data successfully saved to', jsonFilePath);
            }
        });
    });
};

// Membaca data dari file JSON
const inputData = require(`./output/${env.DIR}/${env.FILE_INPUT}_output.json`);
processData(inputData);