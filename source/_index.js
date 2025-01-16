const data = require("./output.json");

function createFormData(data) {
    const formData = new FormData();

    if (Array.isArray(data.unit)) {
        data.unit.forEach(unit => formData.append("unit[]", unit));
    }

    if (Array.isArray(data.tarif_detail)) {
        data.tarif_detail.forEach(detail => formData.append("tarif_detail[]", JSON.stringify(detail)));
    }

    Object.keys(data).forEach(key => {
        if (!["unit", "tarif_detail", "komponen_tarif"].includes(key)) {
            const value = data[key];
            if (typeof value === "object" && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }
    });

    if (data.komponen_tarif) {
        formData.append("komponen_tarif", JSON.stringify(data.komponen_tarif));
    }

    return formData;
}

const dataPayload = data;
const saveURL = "http://localhost/rsakranji/index.php/api/master/tarif_pelayanan_v2/save";

const promises = dataPayload.map(dataPayload => {
    const formData = createFormData(dataPayload);

    return fetch(saveURL, {
        method: "POST",
        body: formData,
        headers: {
            Cookie: "cookie:ajs_anonymous_id=c49ec1fb-a11c-4536-9ede-eb35c6d9477b; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IkI2RW5uWndpZlN1bVNHdnRvNU9FR1E9PSIsInZhbHVlIjoiTG5zOFl2ZGFDRU9zKy9lNXo2NVA4NEFxTXpIcURyeFNYclFHSVQ1RUVkQmlVZkVJSDA5Skpxc2YvYngzenZ6OFM3SU1pelVCU3pxTElxRVIySzVkSmtKdVk3a2RYdjRVelNmbmpMTEtSRVpvRjUrTnlObmtjQnhHb3BmaXBMODg4ekIwRkFDZE1QSlJYVkQ2aUFOeWZCeU1tWGMrbGxqQ0ovWCtPTWFZblAwbVUxWUtwd085UXhpTXI5WXg0V1R0Zi9xVHN1L0FOVGdRcEdRb0pSOWJEcSs5V2l1MUlhbjQxaHZuZ2l2M1BBQT0iLCJtYWMiOiI1YzdlODdhMjVkNzlkZTQ2MzEyNDQ4YmEzNjhiMjdhZTZlZTk5OGE5MTYwMGQ4YTdjMjM4MmEzNjg0ZTk2YTYxIiwidGFnIjoiIn0%3D; twk_uuid_663d9d7b07f59932ab3dfb21=%7B%22uuid%22%3A%221.HQ0Kkt2MAHe69mwpELvooVGM47xvKuCXbp3n8F5qX28WlxCeblp9iD9o6hioR5GF7WRX4WE1cbehtW3J7vZb73cbvwFUYm4N49K5u%22%2C%22version%22%3A3%2C%22domain%22%3Anull%2C%22ts%22%3A1723350523072%7D; twk_uuid_6745d6894304e3196ae8ff5f=%7B%22uuid%22%3A%221.HQ1aA6sCnVvIJkTWxaSJTrJlXEGfPGqkvjBCehUDqMUqaaKXyZ2kIT1I5Mgr94oslfTA cliIrvGley4HOXBX27RHEn3euzoFX9By6%22%2C%22version%22%3A3%2C%22domain%22%3Anull%2C%22ts%22%3A1732636907173%7D; rsan_session=734f0hn0e9nrjoqvv1q6004940ic7u7j"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("[1] Berhasil mengirim");
        })
        .catch(error => {
            console.error("[1] Gagal mengirim data");
        });
});

Promise.allSettled(promises).then(results => {
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`[${index + 1}] Pengiriman data berhasil:`, result.value);
        } else {
            console.log(`[${index + 1}] Pengiriman data gagal:`, result.reason);
        }
    });
});