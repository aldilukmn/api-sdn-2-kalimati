import { normalizeParent } from '../helper/normalize';
import RegistrationRequest from '../models/dto/registration.dto';
import Registration from '../models/entity/registration.entity';
import RegistrationRepository from '../repositories/registration.repo';
import { capitalizeWords, validateAddress, validateNik, validateNokk, validateParent } from '../utils';
import CounterSchema from '../models/schema/counter.schema';

export default class RegistrationService {
  static register = async (
    payload: RegistrationRequest
  ): Promise<RegistrationRequest | undefined> => {
    try {
      const {
        student,
        father,
        mother,
        contactPhoneNumber,
        guardian,
        hasGuardian
      } = payload;

    const existingStudent =
    await RegistrationRepository.findByStudentNik(student.nik);

    if (existingStudent) {
      throw new Error("NIK siswa sudah terdaftar");
    }

    if (!student) {
      throw new Error("Data siswa wajib diisi!");
    }
      
    if (!student.fullName) {
      throw new Error("Nama lengkap siswa wajib diisi!");
    }

    if (!student.gender) {
        throw new Error("Jenis kelamin wajib diisi!");
    }
      
    validateNik(student.nik, 'NIK siswa');
    validateNokk(student.noKk, 'Nomor KK siswa');
    
    if (!student.birthPlace) {
      throw new Error("Tempat lahir wajib diisi!");
    }

    if (!student.birthDate) {
        throw new Error("Tanggal lahir wajib diisi!");
    }
      
    if (!student.religion) {
      throw new Error("Agama wajib diisi!");
    }
    
    if (!student.address) {
      throw new Error("Alamat wajib diisi!");
    }
    
    validateAddress(student.address);
      
    if (!student.childOrder) {
      throw new Error("Urutan anak dalam keluarga wajib diisi!");
    }

    if (!student.numberOfSiblings) {
      throw new Error("Jumlah saudara kandung wajib diisi!");
    }
      
    if (!contactPhoneNumber) {
      throw new Error("Nomor telepon wajib diisi!");
      }
      
    student.kindergartenOrigin = !student.kindergartenOrigin
    ? "Tidak Sekolah TK/RA"
    : student.kindergartenOrigin.trim();
      
    validateParent(father, 'ayah');
    validateParent(mother, 'ibu');
    
    if (hasGuardian) {
      if (!guardian) {
        throw new Error("Data wali wajib diisi!");
      }
      if (!guardian.name) {
        throw new Error("Nama wali wajib diisi!");
      }
      if (!guardian.relationship) {
        throw new Error("Hubungan wali dengan siswa wajib diisi!");
      }
      if (!guardian.phoneNumber) {
        throw new Error("Nomor telepon wali wajib diisi!");
      }
    }
    
      // const totalRegistrations = await RegistrationModel.countDocuments();
      const counter = await CounterSchema.findOneAndUpdate(
        { _id: 'registrationNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const registrationNumber =
      `PMB26-SD-${String(counter.seq).padStart(3, "0")}`;
      
      const newRegistration: RegistrationRequest = {
        ...payload,
        student: {
          ...student,
          fullName: capitalizeWords(student.fullName),
          birthPlace: capitalizeWords(student.birthPlace),
          address: {
            ...student.address,
            street: capitalizeWords(student.address.street),
            village: capitalizeWords(student.address.village),
            district: capitalizeWords(student.address.district)
          },
        },
        father: normalizeParent(father),
        mother: normalizeParent(mother),
        registrationNumber,
        status: 'unvalidated',
        hasGuardian: hasGuardian ?? false,
        guardian: hasGuardian && guardian ? {
          name: capitalizeWords(guardian.name?.trim()),
          relationship: capitalizeWords(guardian.relationship?.trim()),
          phoneNumber: guardian.phoneNumber?.trim()
        } : undefined
      };

      await RegistrationRepository.createRegistration(
        newRegistration
      );

      return newRegistration;
    } catch (e: any) {
      if (e.code === 11000) {
        if (e.keyPattern && e.keyPattern['student.nik']) {
          throw new Error("NIK siswa sudah terdaftar! Silakan coba lagi.");
        }
        throw new Error("Nomor pendaftaran sudah digunakan! Silakan coba lagi.");
      }
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  };

  static getAll = async (): Promise<Registration[]> => {
  return await RegistrationRepository.getAllRegistrations();
  }
  static getById = async (
  id: string
  ): Promise<Registration> => {
    const registration =
      await RegistrationRepository.getRegistrationById(id);

    if (!registration) {
      throw new Error("Data pendaftaran tidak ditemukan!");
    }

    return registration;
  }
  static updateData = async (
    id: string,
    payload: Partial<RegistrationRequest>
  ): Promise<Registration> => {
    try {
      const existing = await RegistrationRepository.getRegistrationById(id);

      if (!existing) {
        throw new Error("Data pendaftaran tidak ditemukan!");
      }

      const updateData: Record<string, any> = {};

      if (payload.status) {
        if (!['unvalidated', 'validated'].includes(payload.status)) {
          throw new Error("Status tidak valid!");
        }
        updateData.status = payload.status;
      }

      if (payload.student) {
        const student = payload.student;

        if (!student.fullName) throw new Error("Nama lengkap siswa wajib diisi!");
        if (!student.gender) throw new Error("Jenis kelamin wajib diisi!");
        if (!student.nik) throw new Error("NIK siswa wajib diisi!");
        if (!student.noKk) throw new Error("Nomor KK siswa wajib diisi!");
        if (!student.birthPlace) throw new Error("Tempat lahir wajib diisi!");
        if (!student.birthDate) throw new Error("Tanggal lahir wajib diisi!");
        if (!student.religion) throw new Error("Agama wajib diisi!");
        if (!student.childOrder) throw new Error("Urutan anak dalam keluarga wajib diisi!");
        if (!student.numberOfSiblings) throw new Error("Jumlah saudara kandung wajib diisi!");

        validateNik(student.nik, 'NIK siswa');
        validateNokk(student.noKk, 'Nomor KK siswa');

        if (!student.address) throw new Error("Alamat wajib diisi!");
        validateAddress(student.address);

        const existingNik = await RegistrationRepository.findByStudentNik(student.nik);
        if (existingNik && existingNik._id.toString() !== id) {
          throw new Error("NIK siswa sudah terdaftar!");
        }

        updateData.student = {
          ...student,
          fullName: capitalizeWords(student.fullName),
          birthPlace: capitalizeWords(student.birthPlace),
          kindergartenOrigin: !student.kindergartenOrigin
            ? "Tidak Sekolah TK/RA"
            : student.kindergartenOrigin.trim(),
          address: {
            ...student.address,
            street: capitalizeWords(student.address.street),
            village: capitalizeWords(student.address.village),
            district: capitalizeWords(student.address.district)
          }
        };
      }

      if (payload.father) {
        validateParent(payload.father, 'ayah');
        updateData.father = normalizeParent(payload.father);
      }

      if (payload.mother) {
        validateParent(payload.mother, 'ibu');
        updateData.mother = normalizeParent(payload.mother);
      }

      if (payload.contactPhoneNumber) {
        updateData.contactPhoneNumber = payload.contactPhoneNumber;
      }

      if (payload.hasGuardian !== undefined) {
        if (payload.hasGuardian) {
          const guardian = payload.guardian;
          if (!guardian) throw new Error("Data wali wajib diisi!");
          if (!guardian.name) throw new Error("Nama wali wajib diisi!");
          if (!guardian.relationship) throw new Error("Hubungan wali dengan siswa wajib diisi!");
          if (!guardian.phoneNumber) throw new Error("Nomor telepon wali wajib diisi!");
          updateData.guardian = {
            name: capitalizeWords(guardian.name?.trim()),
            relationship: capitalizeWords(guardian.relationship?.trim()),
            phoneNumber: guardian.phoneNumber?.trim()
          };
          updateData.hasGuardian = true;
        } else {
          updateData.guardian = null;
          updateData.hasGuardian = false;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("Tidak ada data yang diupdate!");
      }

      const updated = await RegistrationRepository.updateRegistration(id, updateData);

      if (!updated) {
        throw new Error("Gagal mengupdate data pendaftaran!");
      }

      return updated;
    } catch (e: any) {
      if (e.code === 11000) {
        if (e.keyPattern && e.keyPattern['student.nik']) {
          throw new Error("NIK siswa sudah terdaftar!");
        }
      }
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw e;
    }
  }; 

  static getTotalCount = async (): Promise<number> => {
  return await RegistrationRepository.getTotalCount();
}
}