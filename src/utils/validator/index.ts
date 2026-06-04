import { ParentRequest } from '../../models/dto/registration.dto';

export const validateNik = (
  nik: string,
  label: string
): void => {
  if (!nik) {
    throw new Error(`${label} wajib diisi!`);
  }

  if (!/^\d{16}$/.test(nik)) {
    throw new Error(
      `${label} harus terdiri dari 16 digit angka!`
    );
  }

  if (nik.length !== 16) {
    throw new Error("Nomor KK siswa harus 16 digit!");
  }
};

export const validateNokk = (
  nokk: string,
  label: string
): void => {
  if (!nokk) {
    throw new Error(`${label} wajib diisi!`);
  }

  if (!/^\d{16}$/.test(nokk)) {
    throw new Error(
      `${label} harus terdiri dari 16 digit angka!`
    );
  }

  if (nokk.length !== 16) {
    throw new Error("Nomor KK siswa harus 16 digit!");
  }
};

export const validateParent = (
  parent: ParentRequest,
  label: string
): void => {
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

  validateNik(parent.nik, `NIK ${label}`);
};

export const validateAddress = (address: any): void => {
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