import { normalizeParent } from '../helper/normalize';
import RegistrationRequest from '../models/dto/registration.dto';
import Registration from '../models/entity/registration.entity';
import RegistrationRepository from '../repositories/registration.repo';
import { capitalizeWords, validateAddress, validateNik, validateNokk, validateParent } from '../utils';
import RegistrationModel from '../models/schema/registration.schema';

export default class RegistrationService {
  static register = async (
    payload: RegistrationRequest
  ): Promise<RegistrationRequest | undefined> => {
    try {
      const {
        student,
        father,
        mother,
        contactPhoneNumber
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
      
    !student.kindergartenOrigin ? "Tidak Sekolah TK/RA" : student.kindergartenOrigin.trim()
    
    validateParent(father, 'ayah');
    validateParent(mother, 'ibu');
    
    // Validate guardian data if present
    const { guardian } = payload;
    if (guardian && (guardian.name || guardian.relationship || guardian.phoneNumber)) {
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
    
    const totalRegistrations = await RegistrationModel.countDocuments();

    const registrationNumber =
    `SPMB26-SD-${String(totalRegistrations + 1).padStart(3, "0")}`;
      
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
        hasGuardian: guardian ? (guardian.name || guardian.relationship || guardian.phoneNumber ? true : false) : false,
        guardian: guardian ? {
          name: capitalizeWords(guardian.name?.trim()),
          relationship: capitalizeWords(guardian.relationship?.trim()),
          phoneNumber: guardian.phoneNumber?.trim()
        } : undefined
      };

      await RegistrationRepository.createRegistration(
        newRegistration
      );

      return newRegistration;
    } catch (e) {
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
  static updateStatus = async (
    id: string,
    status: 'unvalidated' | 'validated'
  ): Promise<Registration> => {
    try {
      if (!status || !['unvalidated', 'validated'].includes(status)) {
        throw new Error("Status tidak valid!");
      }

      const registration = await RegistrationRepository.getRegistrationById(id);
      
      if (!registration) {
        throw new Error("Data pendaftaran tidak ditemukan!");
      }

      const updated = await RegistrationRepository.updateStatus(id, status);
      
      if (!updated) {
        throw new Error("Gagal mengubah status!");
      }

      return updated;
    } catch (e) {
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