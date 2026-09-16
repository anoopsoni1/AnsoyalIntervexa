import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOHeadProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  canonicalPath?: string;
  ogType?: string;
  ogImage?: string;
}

const DOMAIN = "https://ansoyal.co-vid.in";
const DEFAULT_TITLE = "Ansoyal AI Recruiter — Discover Verified Talent";
const DEFAULT_DESCRIPTION = "Discover candidates through verified skills, coding assessments, AI interviews, projects, GitHub evidence, and employability signals with Ansoyal AI.";
const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.png`;

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  noindex = true, // Default to secure noindex for candidate & recruiter privacy
  canonicalPath,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | Ansoyal AI Recruiter` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (selector: string, attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Meta Description
    setMetaTag('meta[name="description"]', "name", "description", description);

    // 3. Meta Robots (Crucial for Candidate Privacy)
    const robotsContent = noindex ? "noindex, nofollow, noarchive" : "index, follow";
    setMetaTag('meta[name="robots"]', "name", "robots", robotsContent);

    // 4. Canonical Link
    const currentPath = canonicalPath || location.pathname;
    const canonicalUrl = `${DOMAIN}${currentPath === "/" ? "" : currentPath}`;
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute("href", canonicalUrl);

    // 5. Open Graph Tags
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "Ansoyal AI Recruiter");
    setMetaTag('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);

    // 6. Twitter / X Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

  }, [title, description, noindex, canonicalPath, location.pathname, ogType, ogImage]);

  return null;
};
