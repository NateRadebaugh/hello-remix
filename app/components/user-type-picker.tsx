import { useQuery } from "react-query";
import type { getUserTypes } from "~/models/appCodeDetail.server";
import type { Unarray } from "~/utils/types";
import StandardDropdown from "./standard-dropdown";

export interface PostTypePickerProps<TFormData> {
  name: Extract<keyof TFormData, string>;
  defaultValue?: string;
  initialData: Awaited<ReturnType<typeof getUserTypes>>;
}

export default function UserTypePicker<TFormData>({
  name,
  defaultValue,
  initialData,
}: PostTypePickerProps<TFormData>) {
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
    <StandardDropdown<
      TFormData,
      Unarray<Awaited<ReturnType<typeof getUserTypes>>>
    >
      name={name}
      initialData={initialData}
      placeholder="Select a type..."
      labelField="CodeValue"
      valueField="CodeValue"
      defaultValue={defaultValue}
      fetcher={() =>
        fetch(`/api/user-type-search`).then(
          (res) =>
            res.json() as unknown as Awaited<ReturnType<typeof getUserTypes>>
        )
      }
    />
  );
}
