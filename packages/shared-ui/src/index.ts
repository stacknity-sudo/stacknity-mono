// Import CSS styles
import "./components/button/Button.module.css";
import "./components/input/Input.module.css";
import "./components/card/Card.module.css";
import "./components/checkbox/Checkbox.module.css";
import "./components/Modal/Modal.module.css";

// Re-export common React types
export type { ComponentProps, ReactNode, ReactElement } from "react";

// Export components
export { Button } from "./components/button/Button";
export type { ButtonProps } from "./components/button/Button";

export { Input } from "./components/input/Input";
export type { InputProps } from "./components/input/Input";

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "./components/card/Card";
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from "./components/card/Card";

// Icons (curated)
export * from "./icons/fi";

// Note: Modal temporarily removed due to dependency issues
// export { Modal } from "./components/Modal/Modal";
// export type { ModalProps } from "./components/Modal/Modal";
