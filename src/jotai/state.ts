import { atom } from 'jotai';

interface FormDetails {
  orgId?: string;
  orgName?: string;
  formId?: string;
  formName?: string;
  formDescription?: string;
  pathname?: string;
}

export const formDetailsAtom = atom<FormDetails>({
  orgId: undefined,
  orgName: undefined,
  formId: undefined,
  formName: undefined,
  formDescription: undefined,
  pathname: undefined,
});
