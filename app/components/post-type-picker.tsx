import { useQuery } from "react-query";
import { SelectOption } from "~/post";

export interface PostTypePickerProps {
  name: string;
  defaultValue?: string;
}

export default function PostTypePicker({
  name,
  defaultValue,
}: PostTypePickerProps) {
  const { isLoading, error, data } = useQuery<SelectOption[]>("repoData", () =>
    fetch("/api/post-type-search").then((res) => res.json())
  );

  if (isLoading) return <>Loading...</>;

  if (error) return <>An error has occurred.</>;

  return (
    <>
      <select className="form-select" name={name} defaultValue={defaultValue}>
        <option selected disabled hidden>
          Select a type...
        </option>
        {data?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
