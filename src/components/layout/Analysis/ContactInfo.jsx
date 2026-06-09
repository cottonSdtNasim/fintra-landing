import { useEffect, useState } from "react";
import { Typography } from "../../common/Typography";
import { companyDetailsApi } from "../../../api/companyDetailsApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import NormalCard from "../../common/NormalCard";

export default function ContactInfo({ instrumentCode }) {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchContactInfo = async () => {
      if (!instrumentCode) {
        setLoading(false);
        setCompanyInfo(null);
        return;
      }

      setLoading(true);

      try {
        const res = await companyDetailsApi.getCompanyContact(instrumentCode);

        if (cancelled) return;

        if (res?.success) {
          setCompanyInfo(res.data[0] ?? null);
        } else {
          setCompanyInfo(null);
        }
      } catch (_) {
        if (!cancelled) {
          setCompanyInfo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContactInfo();

    return () => {
      cancelled = true;
    };
  }, [instrumentCode]);

  return (
    <div>
      <NormalCard>
        <div className="p-4">
          <Typography
            variant="text14"
            className="mb-8 font-medium  text-(--primary-white)"
          >
            Company Address
          </Typography>

          {loading ? (
            <div className="h-64 flex items-center justify-center ">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-4">
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Head Office
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.head_office || "-"}
                </Typography>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Factory
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.factory || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Contact Phone
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.contact_phone || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Fax
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.fax || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Company E-mail
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.company_email || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Web Address
                </Typography>
                {/* Break big words text */}

                {companyInfo?.web_address ? (
                  <a
                    href={companyInfo.web_address}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      variant="p"
                      className="font-regular text-(--tertiary-green) wrap-break-word"
                    >
                      {companyInfo.web_address}
                    </Typography>
                  </a>
                ) : (
                  <Typography>{"-"}</Typography>
                )}
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Company Secretary
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.company_secretary_name || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Secretary Cell No.
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.cell_no || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Secretary Telephone No.
                </Typography>
                <Typography variant="p" className="font-regular">
                  {companyInfo?.telephone_no || "-"}
                </Typography>
              </div>

              <div>
                <Typography
                  variant="Span9"
                  className="mb-2 font-medium  text-(--primary-white)"
                >
                  Secretary E-mail
                </Typography>
                <Typography
                  variant="p"
                  className="font-regular wrap-break-word"
                >
                  {companyInfo?.secretary_email || "-"}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </NormalCard>
    </div>
  );
}
