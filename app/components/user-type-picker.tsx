import { useQuery } from "react-query";
import type { getUserTypes } from "~/models/appCodeDetail.server";

export interface PostTypePickerProps {
  name: string;
  defaultValue?: string;
  initialData: Awaited<ReturnType<typeof getUserTypes>>;
}

export default function UserTypePicker({
  name,
  defaultValue,
  initialData,
}: PostTypePickerProps) {
  const { isLoading, error, data } = useQuery<
    Awaited<ReturnType<typeof getUserTypes>>
  >(
    "repoData",
    () => fetch(`/api/user-type-search`).then((res) => res.json()),
    { initialData: initialData }
  );

  if (isLoading)
    return (
      <>
        <select className="form-select" name={name} disabled value="">
          <option value="" disabled hidden>
            Loading...
          </option>
        </select>
      </>
    );

  if (error) return <>An error has occurred.</>;

  return (
    <>
      <select
        className="form-select"
        name={name}
        defaultValue={defaultValue ?? ""}
      >
        <option value="" disabled hidden>
          Select a type...
        </option>
        {data?.map((option) => (
          <option key={option.AppCodeDetailId} value={option.CodeValue}>
            {option.CodeValue}
          </option>
        ))}
      </select>
    </>
  );
}
