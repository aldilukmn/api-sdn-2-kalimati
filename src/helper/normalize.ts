import { ParentRequest } from '../models/dto/registration.dto';
import { capitalizeWords } from '../utils';

export const normalizeParent = (parent: ParentRequest) => ({
  ...parent,
  name: capitalizeWords(parent.name)
});