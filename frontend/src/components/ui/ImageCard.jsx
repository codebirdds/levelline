/** Image with bottom gradient + text slot. Size it from outside via className (aspect-*, h-*). */
export default function ImageCard({ image, alt = "", className = "", children }) {
  return (
    <article className={`group relative overflow-hidden rounded-sm bg-ink ${className}`}>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-cream lg:p-10 lg:pl-4 lg:pb-5">
        {children}
      </div>
    </article>
  );
}
