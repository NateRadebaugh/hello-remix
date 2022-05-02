/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useQuery } from "react-query";

export interface StandardDropdownProps<
  TModel,
  TMultiple extends never | true = never
> {
  name: string;
  defaultValue?: TMultiple extends boolean ? string[] : string | undefined;
  multiple?: TMultiple;
  initialData: TModel[];
  placeholder?: string;
  fetcher: () => Promise<TModel[]>;
  labelField: keyof TModel;
  valueField: keyof TModel;
}

export default function StandardDropdown<TModel>({
  name,
  defaultValue,
  initialData,
  placeholder,
  fetcher,
  valueField,
  labelField,
}: StandardDropdownProps<TModel>) {
  const { isLoading, error, data } = useQuery<
    Awaited<ReturnType<typeof fetcher>>
  >("repoData", fetcher, { initialData: initialData });

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
      <select className="form-select" name={name} defaultValue={defaultValue}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        <option></option>
        {data?.map((option) => (
          <option
            key={option[valueField] as any}
            value={option[valueField] as any}
          >
            {option[labelField] as any}
          </option>
        ))}
      </select>
    </>
  );
}
