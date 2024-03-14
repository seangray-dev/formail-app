import { atom } from 'jotai';

interface Admin {
  id: string;
  name?: string;
  email?: string;
}

interface FormDetails {
  orgId?: string;
  orgName?: string;
  admins?: Admin[];
  formId?: string;
  formName?: string;
  formDescription?: string;
  pathname?: string;
}

export const formDetailsAtom = atom<FormDetails>({
  orgId: undefined,
  orgName: undefined,
  admins: [],
  formId: undefined,
  formName: undefined,
  formDescription: undefined,
  pathname: undefined,
});
