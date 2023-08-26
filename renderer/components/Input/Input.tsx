import { Combobox, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import React from "react";

export type ILeague = {
  id: string;
  name: string;
  image: string;
};

interface InputProps
  extends React.PropsWithoutRef<React.JSX.IntrinsicElements["input"]> {
  label?: string;
  icon?: React.JSX.Element;
  clear?: () => void;
}

export const Input = ({
  content,
  label,
  selected,
  setSelected,
}: {
  content: ILeague[];
  label?: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [search, setSearch] = React.useState<string>("");

  const filteredContent = !search
    ? content
    : content?.filter((c) =>
        c.name.toLowerCase().startsWith(search.toLowerCase())
      );

  return (
    <Combobox value={selected} onChange={setSelected}>
      {label && <label className="text-white text-lg">{label}</label>}
      <Combobox.Input
        className={"h-10 rounded-md w-full indent-2"}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="w-full relative">
        <Combobox.Options
          className={
            "absolute z-90 max-h-40 w-full overflow-auto rounded-b-xl bg-white"
          }
        >
          {filteredContent.map((c) => (
            <Combobox.Option key={c.id} value={c.name}>
              <div className="flex flex-row py-1 items-center pl-2 gap-2 cursor-pointer hover:bg-gray-200">
                <Image src={c.image} width={30} height={30} />
                {c.name}
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default Input;
