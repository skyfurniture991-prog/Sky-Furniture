import { motion } from "framer-motion";
import { waLink } from "../../data/store";

export default function WhatsAppFab() {
  return (
    <motion.a
      href={waLink("Halo Sky Furniture, saya ingin konsultasi sofa.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16.04 3C8.84 3 3 8.83 3 16c0 2.3.6 4.55 1.75 6.53L3 29l6.65-1.7A13 13 0 0 0 16.04 29C23.2 29 29 23.17 29 16S23.2 3 16.04 3Zm0 23.7c-2 0-3.95-.54-5.66-1.56l-.4-.24-3.95 1.01 1.05-3.84-.27-.4A10.6 10.6 0 0 1 5.4 16c0-5.9 4.77-10.7 10.64-10.7 5.88 0 10.66 4.8 10.66 10.7 0 5.9-4.78 10.7-10.66 10.7Zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.5-.16-.72.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.36-.5-2.59-1.6-.96-.86-1.6-1.9-1.8-2.22-.18-.33-.02-.5.14-.66.15-.14.33-.38.5-.57.16-.19.21-.33.32-.55.1-.22.05-.4-.03-.57-.08-.16-.72-1.75-.99-2.4-.26-.63-.53-.54-.72-.55h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72 0 1.6 1.17 3.15 1.33 3.37.16.22 2.3 3.5 5.57 4.92.78.34 1.38.54 1.86.7.78.25 1.5.21 2.06.13.63-.1 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </motion.a>
  );
}
