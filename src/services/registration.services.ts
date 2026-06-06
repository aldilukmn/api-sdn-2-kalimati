import { count } from 'console';
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
    
    validateAddress(student.address);
      
    if (!student.childOrder) {
      throw new Error("Urutan anak dalam keluarga wajib diisi!");
    }
      
    if (!contactPhoneNumber) {
      throw new Error("Nomor telepon wajib diisi!");
    }
    
    validateParent(father, 'ayah');
    validateParent(mother, 'ibu');
    
    const totalRegistrations = await RegistrationModel.countDocuments();

    const registrationNumber =
    `PPDB26-SD-${String(totalRegistrations + 1).padStart(3, "0")}`;
      
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
        status: 'Unvalidated'
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