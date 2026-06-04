"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddress = exports.validateParent = exports.validateNokk = exports.validateNik = void 0;
const validateNik = (nik, label) => {
    if (!nik) {
        throw new Error(`${label} wajib diisi!`);
    }
    if (!/^\d{16}$/.test(nik)) {
        throw new Error(`${label} harus terdiri dari 16 digit angka!`);
    }
    if (nik.length !== 16) {
        throw new Error("Nomor KK siswa harus 16 digit!");
    }
};
exports.validateNik = validateNik;
const validateNokk = (nokk, label) => {
    if (!nokk) {
        throw new Error(`${label} wajib diisi!`);
    }
    if (!/^\d{16}$/.test(nokk)) {
        throw new Error(`${label} harus terdiri dari 16 digit angka!`);
    }
    if (nokk.length !== 16) {
        throw new Error("Nomor KK siswa harus 16 digit!");
    }
};
exports.validateNokk = validateNokk;
const validateParent = (parent, label) => {
    if (!parent) {
        throw new Error(`Data ${label} wajib diisi!`);
    }
    if (!parent.name) {
        throw new Error(`Nama ${label} wajib diisi!`);
    }
    if (!parent.birthYear) {
        throw new Error(`Tahun lahir ${label} wajib diisi!`);
    }
    if (!parent.occupation) {
        throw new Error(`Pekerjaan ${label} wajib diisi!`);
    }
    if (!parent.education) {
        throw new Error(`Pendidikan terakhir ${label} wajib diisi!`);
    }
    if (!parent.monthlyIncome) {
        throw new Error(`Pendapatan bulanan ${label} wajib diisi!`);
    }
    (0, exports.validateNik)(parent.nik, `NIK ${label}`);
};
exports.validateParent = validateParent;
const validateAddress = (address) => {
    const fields = [
        { key: "street", label: "Alamat" },
        { key: "rt", label: "RT" },
        { key: "rw", label: "RW" },
        { key: "village", label: "Desa" },
        { key: "district", label: "Kecamatan" },
        { key: "postalCode", label: "Kode Pos" }
    ];
    for (const field of fields) {
        if (!address[field.key]) {
            throw new Error(`${field.label} wajib diisi!`);
        }
    }
};
exports.validateAddress = validateAddress;
