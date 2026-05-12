export const getAssetPath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const baseUrl = import.meta.env.BASE_URL || '/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  // Clean the path and encode it, but preserve slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  return `${base}${encodedPath}`;
};
