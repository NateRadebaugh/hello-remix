import { AppCodeDetail } from "@prisma/client";
import { useQuery } from "react-query";

export interface PostTypePickerProps {
  name: string;
  defaultValue?: string;
}

export default function UserTypePicker({
  name,
  defaultValue,
}: PostTypePickerProps) {
  const { isLoading, error, data } = useQuery<AppCodeDetail[]>("repoData", () =>
    fetch(`/api/user-type-search`).then((res) => res.json())
  );

  if (isLoading)
    return (
      <>
        <select className="form-select" name={name} disabled>
          <option selected disabled hidden>
            Loading...
          </option>
        </select>
      </>
    );

  if (error) return <>An error has occurred.</>;

  return (
    <>
      <select className="form-select" name={name} defaultValue={defaultValue}>
        <option selected disabled hidden>
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
