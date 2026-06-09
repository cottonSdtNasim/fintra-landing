import { SecurityCodePageView } from "../../../components/layout/SecurityCodePageView";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const security_code = resolvedParams.security_code;
  
  return {
    title: `${security_code} | BrokerEdge Analysis`,
    description: `Detailed analysis and charts for ${security_code}.`,
  };
}

export default async function SecurityCodePage({ params }) {
  const resolvedParams = await params;
  const security_code = resolvedParams.security_code;

  return <SecurityCodePageView securityCode={security_code} />;
}
