import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function SuspenseView() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Spinner variant="circle" className="w-24 h-24" />
    </div>
  );
}
