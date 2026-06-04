import { normalizeParent } from '../helper/normalize';
import RegistrationRequest from '../models/dto/registration.dto';
import Registration from '../models/entity/registration.entity';
import RegistrationRepository from '../repositories/registration.repo';
import { capitalizeWords, validateAddress, validateNik, validateNokk, validateParent } from '../utils';


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
    validateNokk(student.nokk, 'Nomor KK siswa');
    
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
      
    if (!contactPhoneNumber) {
      throw new Error("Nomor telepon wajib diisi!");
    }
    
    validateParent(father, 'ayah');
    validateParent(mother, 'ibu');
    
      const registrationNumber =
      "PPDB-" +
      new Date().getFullYear() +
      "-" +
      Date.now();
      
      const newRegistration: RegistrationRequest = {
        ...payload,
        student: {
          ...student,
          fullName: capitalizeWords(student.fullName),
          birthPlace: capitalizeWords(student.birthPlace)
        },
        father: normalizeParent(father),
        mother: normalizeParent(mother),
        registrationNumber,
        status: 'pending'
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
}