// hooks/useOrgUserDetails.js or a similar file

import { useOrganization, useUser } from "@clerk/nextjs";

export function useOrgUserDetails() {
  const organization = useOrganization();
  const user = useUser();

  let orgId, orgName, isLoading;

  if (organization.isLoaded && user.isLoaded && user.isSignedIn) {
    orgId = organization.organization?.id ?? user.user?.id;
    orgName = organization.organization?.name ?? "Personal Account";
    isLoading = false;
  } else {
    isLoading = true;
  }

  return { orgId, orgName, user, isLoading };
}
