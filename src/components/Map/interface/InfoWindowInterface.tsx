interface InfoWindowProps {
  title: string;
  category?: string;
  roadAddress?: string;
  address?: string;
  phone?: string;
  placeUrl?: string;
}

export const InfoWindowInterface = ({
                                      title,
                                      category,
                                      roadAddress,
                                      address,
                                      phone,
                                      placeUrl,
                                    }: InfoWindowProps): string => {
  return `
    <div style="padding:12px 16px; max-width:260px; font-size:14px;">
      <strong style="font-size:16px;">${title}</strong>
      <div style="margin-top:6px;">${category || ''}</div>
      <div style="margin-top:4px;">도로명: ${roadAddress || '-'}</div>
      <div>지번주소: ${address || '-'}</div>
      <div>전화번호: ${phone || '-'}</div>
          ${placeUrl ? 
          `<div>
            <a href="${placeUrl}" target="_blank" style="color:#2563EB; text-decoration:underline;">카카오 장소 보기</a>
          </div>`
            : ''
          }
    </div>
  `;
};
