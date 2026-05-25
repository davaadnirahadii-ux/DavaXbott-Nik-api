const data = require('./data.json');

const provinces = data.provinces;
const regencies = data.regencies;
const districts = data.districts;

async function validateNIK(nik) {
    nik = nik.replace(/\D/g, '');
    if (nik.length !== 16) return { valid: false, error: 'NIK harus 16 digit' };
    
    const tanggal = parseInt(nik.substring(6, 8));
    const bulan = parseInt(nik.substring(8, 10));
    const tahun = nik.substring(10, 12);
    const provincesCode = nik.substring(0, 2);
    const regenciesCode = nik.substring(0, 4);
    const districtsCode = nik.substring(0, 6);
    const uniqcode = nik.substring(12, 16);
    
    if (bulan < 1 || bulan > 12) return { valid: false, error: 'Bulan tidak valid' };
    
    let jeniskelamin = 'LAKI-LAKI';
    if (tanggal > 40) jeniskelamin = 'PEREMPUAN';
    
    const actualDay = tanggal > 40 ? tanggal - 40 : tanggal;
    const maxDay = new Date(2000, bulan, 0).getDate();
    if (actualDay < 1 || actualDay > maxDay) return { valid: false, error: 'Tanggal tidak valid' };
    
    const fullYear = parseInt(tahun) + (parseInt(tahun) < 50 ? 2000 : 1900);
    
    let latitude = null;
    let longitude = null;
    let timezone = 'Asia/Jakarta';
    
    let mapsLink = '#';
    if (latitude !== null && longitude !== null) {
        mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else {
        const kabkota = regencies[regenciesCode] || '';
        if (kabkota !== 'Tidak diketahui') {
            const encodedLocation = encodeURIComponent(kabkota + ', Indonesia');
            mapsLink = `https://www.google.com/maps/search/${encodedLocation}`;
        }
    }
    
    const birthDate = new Date(fullYear, bulan - 1, actualDay);
    const today = new Date();
    let age = today.getFullYear() - fullYear;
    if (today.getMonth() < bulan - 1 || (today.getMonth() === bulan - 1 && today.getDate() < actualDay)) {
        age--;
    }
    
    const nextBirthday = new Date(today.getFullYear(), bulan - 1, actualDay);
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    const shioList = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'];
    const shio = shioList[(fullYear - 4) % 12];
    
    const zodiacList = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
    let zodiac = '';
    if ((bulan === 1 && actualDay >= 20) || (bulan === 2 && actualDay <= 18)) zodiac = zodiacList[1];
    else if ((bulan === 2 && actualDay >= 19) || (bulan === 3 && actualDay <= 20)) zodiac = zodiacList[2];
    else if ((bulan === 3 && actualDay >= 21) || (bulan === 4 && actualDay <= 19)) zodiac = zodiacList[3];
    else if ((bulan === 4 && actualDay >= 20) || (bulan === 5 && actualDay <= 20)) zodiac = zodiacList[4];
    else if ((bulan === 5 && actualDay >= 21) || (bulan === 6 && actualDay <= 20)) zodiac = zodiacList[5];
    else if ((bulan === 6 && actualDay >= 21) || (bulan === 7 && actualDay <= 22)) zodiac = zodiacList[6];
    else if ((bulan === 7 && actualDay >= 23) || (bulan === 8 && actualDay <= 22)) zodiac = zodiacList[7];
    else if ((bulan === 8 && actualDay >= 23) || (bulan === 9 && actualDay <= 22)) zodiac = zodiacList[8];
    else if ((bulan === 9 && actualDay >= 23) || (bulan === 10 && actualDay <= 22)) zodiac = zodiacList[9];
    else if ((bulan === 10 && actualDay >= 23) || (bulan === 11 && actualDay <= 21)) zodiac = zodiacList[10];
    else if ((bulan === 11 && actualDay >= 22) || (bulan === 12 && actualDay <= 21)) zodiac = zodiacList[11];
    else zodiac = zodiacList[0];
    
    const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const birthDayName = hariList[birthDate.getDay()];
    
    const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulanName = bulanNames[bulan - 1];
    
    const waktuSekarang = new Date().toLocaleString('id-ID', { timeZone: timezone });
    
    return {
        valid: true,
        nik: nik,
        nama: null,
        tanggalLahir: `${actualDay.toString().padStart(2, '0')}/${bulan.toString().padStart(2, '0')}/${tahun}`,
        tanggalLahirFull: `${fullYear}-${bulan.toString().padStart(2, '0')}-${actualDay.toString().padStart(2, '0')}`,
        hariLahir: birthDayName,
        tanggalAngka: actualDay,
        bulanAngka: bulan,
        bulanNama: bulanName,
        tahunAngka: fullYear,
        jenisKelamin: jeniskelamin,
        umur: age,
        hariMenujuUltah: daysUntilBirthday,
        shio: shio,
        zodiak: zodiac,
        provinsi: provinces[provincesCode] || 'Tidak diketahui',
        kabkota: regencies[regenciesCode] || 'Tidak diketahui',
        kecamatan: districts[districtsCode] || 'Tidak diketahui',
        latitude: latitude,
        longitude: longitude,
        mapsLink: mapsLink,
        timezone: timezone,
        waktuSekarang: waktuSekarang,
        uniqcode: uniqcode
    };
}

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { nik } = req.query;
    
    if (!nik) {
        return res.status(400).json({ 
            error: 'Parameter NIK wajib diisi',
            example: '/?nik=3172020808770034'
        });
    }
    
    const cleanNik = nik.replace(/\D/g, '');
    
    if (cleanNik.length !== 16) {
        return res.status(400).json({ 
            error: 'NIK harus 16 digit angka',
            received: cleanNik
        });
    }
    
    const result = validateNIK(cleanNik);
    res.json(result);
};