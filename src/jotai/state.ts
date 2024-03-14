import { atom } from 'jotai';

interface OrgUser {
  id: string | undefined;
  name: string;
  email: string;
}

interface FormDetails {
  orgId?: string;
  orgName?: string;
  orgUsers?: OrgUser[];
  formId?: string;
  formName?: string;
  formDescription?: string;
  pathname?: string;
}

export const formDetailsAtom = atom<FormDetails>({
  orgId: undefined,
  orgName: undefined,
  orgUsers: [],
  formId: undefined,
  formName: undefined,
  formDescription: undefined,
  pathname: undefined,
});
