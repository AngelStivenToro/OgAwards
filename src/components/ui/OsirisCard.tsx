import Image from "next/image";

const OsirisCard = () => {
    return (
        <div
            className="fixed bottom-2 left-2 p-2 bg-osiris bg-opacity-70 rounded-large shadow-large select-none text-end">
            <p className="text-start text-sm font-medium text-default-white">Desarrollado por</p>

            <Image src="/images/osiris.png" alt="Logo Osiris" className="my-2" width={200} height={53}/>
            <p className="px-2 inline-block rounded-large border border-gray bg-gray/50 text-end text-sm font-medium text-default-white">V {process.env.NEXT_PUBLIC_VERSION_APP}</p>
        </div>
    );
};

export default OsirisCard;