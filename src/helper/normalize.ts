import { ParentRequest } from '../models/dto/registration.dto';
import { capitalizeWords } from '../utils';

export const normalizeParent = (parent: ParentRequest) => ({
  ...parent,
  name: capitalizeWords(parent.name),
  occupation: parent.occupation === "IRT" ? parent.occupation : capitalizeWords(parent.occupation),
});