interface InfoWindowProps {
  title: string;
  category?: string;
  categoryEN?: string;
  roadAddress?: string;
  roadAddressEN?: string;
  address?: string;
  phone?: string;
  placeUrl?: string;
}

export const InfoWindowInterface = ({
                                      title,
                                      categoryEN,
                                      roadAddressEN,
                                      phone,
                                      placeUrl,
                                    }: InfoWindowProps): string => {
  return `
    <div class="bg-white rounded-xl shadow-md p-4 w-[260px] font-sans text-[14px] text-[#1A1E1D]">
      <h3 class="font-bold text-base mb-1">${title}</h3>

      ${categoryEN ? `<p class="text-xs text-gray-600 mb-1">${categoryEN}</p>` : ""}
      <p class="text-sm mb-0.5">
        <span class="font-semibold">Road Address:</span> ${roadAddressEN || "-"}
      </p>
      ${phone ? `<p class="text-sm text-gray-600 mb-0.5">📞 ${phone}</p>` : ""}
      ${
        placeUrl
          ? `<a href="${placeUrl}" target="_blank" rel="noopener noreferrer"
                  class="text-sm text-blue-600 underline inline-block mt-1">
                  View on Kakao (Korean)
                </a>`
          : ""
      }

      <div class="mt-3 flex flex-col gap-2">
        <button data-type="details"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-100 transition cursor-pointer">
          <div class="w-2 h-2 rounded-full border-2 border-blue-500 bg-white shadow-[0_0px_8px_2px_rgba(59,130,246,0.5)]"></div>
          <span class="text-xs font-medium">Show Detail</span>
        </button>
        <div class="flex justify-between">
          <button data-type="origin"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-700 hover:bg-green-100 transition cursor-pointer">
            <div class="w-2 h-2 rounded-full border-2 border-green-600 bg-white shadow-[0_0px_8px_2px_rgba(34,197,94,0.5)]"></div>
            <span class="text-xs font-medium">Origin</span>
          </button>
  
          <button data-type="destination"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-700 hover:bg-red-100 transition cursor-pointer">
            <div class="w-2 h-2 rounded-full border-2 border-red-500 bg-white shadow-[0_0px_8px_2px_rgba(239,68,68,0.5)]"></div>
            <span class="text-xs font-medium">Destination</span>
          </button>
        </div>
      </div>
    </div>
  `;
};
