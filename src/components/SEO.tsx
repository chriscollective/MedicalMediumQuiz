import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function SEO({
  title = "醫療靈媒隨堂測驗 | Medical Medium Quiz",
  description = "測試您對醫療靈媒書籍的理解程度，挑戰初階或進階題目，獲得專屬等級評定！支援多本書籍選擇，包含單選、多選、填空題型，立即測驗您的健康知識。",
  keywords = "醫療靈媒,Medical Medium,安東尼威廉,測驗,健康知識,自然療法,蔬果汁,排毒,慢性疾病,西洋芹汁",
  ogImage = "https://mmquiz.vercel.app/OG.png",
}: SEOProps) {
  // 因為是 SPA，所有頁面的 canonical URL 都指向首頁
  const canonical = "https://mmquiz.vercel.app/";
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
