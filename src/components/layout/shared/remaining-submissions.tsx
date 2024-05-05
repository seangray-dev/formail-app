import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex/react";
import { InfinityIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

export default function RemaingSubmissions() {
  const user = useQuery(api.users.getMe);
  const remainingSubmissions = user?.remainingSubmissions || 0;
  const progressValue = (remainingSubmissions / 500) * 100;
  const isSubActive = useQuery(
    api.utils.checkUserSubscription,
    user ? { userId: user._id } : "skip",
  );

  return (
    <div className="flex flex-col gap-4">
      <p>Remaining Account Submissions</p>
      <Progress
        aria-label="remaining submissions"
        aria-valuetext={`${remainingSubmissions} submissions left`}
        value={progressValue}
      />
      <p className="text-lg font-bold text-primary">
        {isSubActive ? (
          <InfinityIcon />
        ) : (
          <div>{remainingSubmissions} / 500</div>
        )}
      </p>
    </div>
  );
}
