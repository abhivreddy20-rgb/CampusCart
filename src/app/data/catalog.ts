import { Cake, FileText, Gift, Package, Salad } from "lucide-react";

import type { FormState, StepId } from "../types";

export const steps: { id: StepId; label: string }[] = [
  { id: "home", label: "Motto" },
  { id: "preRegistration", label: "Pre Register" },
  { id: "login", label: "Login" },
  { id: "registration", label: "Register" },
  { id: "college", label: "College" },
  { id: "category", label: "Item" },
  { id: "student", label: "Student" },
  { id: "terms", label: "Terms" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Email" },
];

export const categories = [
  {
    id: "Food",
    title: "Food",
    description: "Meals, snacks, drinks, comfort food, and quick treats.",
    packingInstructions: [
      "Use sealed, leak-resistant containers for every food item.",
      "Keep hot and cold items packed separately.",
      "Label any allergens, dietary notes, or freshness timing.",
    ],
    icon: Salad,
  },
  {
    id: "Documents",
    title: "Documents",
    description: "Important papers, forms, certificates, and envelopes.",
    packingInstructions: [
      "Place papers in a sealed envelope or folder.",
      "Use a rigid mailer for certificates or items that cannot bend.",
      "Write the student name and campus handoff details clearly.",
    ],
    icon: FileText,
  },
  {
    id: "Birthday Gifts",
    title: "Birthday Gifts",
    description: "Surprises, and celebration bundles.",
    packingInstructions: [
      "Secure fragile items so they do not shift during handoff.",
      "Pack cakes or flowers in upright, easy-to-carry packaging.",
      "Include the message card separately if it should stay private.",
    ],
    icon: Cake,
  },
  {
    id: "Essentials",
    title: "Essentials",
    description: "Medicines, chargers, stationery, care items, and supplies.",
    packingInstructions: [
      "Keep small items grouped in one closed bag or box.",
      "Seal liquids and personal-care items to prevent spills.",
      "Add quantity, brand, or urgency notes for the delivery team.",
    ],
    icon: Package,
  },
  {
    id: "Custom Gift",
    title: "Custom Gift",
    description: "Anything approved for campus delivery with special notes.",
    packingInstructions: [
      "Use protective packaging for fragile or premium items.",
      "Mention if the item should be hidden, wrapped, or presented openly.",
      "Avoid restricted campus items and include special handling notes.",
    ],
    icon: Gift,
  },
];

export const terms = [
  "Restricted, unsafe, or prohibited campus items cannot be delivered.",
  "Food, documents, and gifts must include accurate student contact details.",
  "Same-day delivery depends on campus availability and successful student contact.",
  "Refunds and cancellations are reviewed before pickup confirmation.",
];

export const liabilityPoints = [
  "DormDrop is not responsible for damage caused by poor, unsafe, or unsealed packaging.",
  "Parents or senders are responsible for ensuring the item is allowed by campus rules.",
  "DormDrop is not responsible for illness, allergic reactions, or health issues after a student consumes delivered food or drinks.",
  "Delivery may be delayed or canceled if the student cannot be reached at the provided contact details.",
  "Perishable items are delivered as packed, and quality after handoff depends on student pickup timing.",
];

export const paymentMethods = ["Credit/Debit Card", "Apple Pay", "PayPal"];

export const initialForm: FormState = {
  parentName: "",
  email: "",
  phone: "",
  password: "",
  college: "",
  category: "Food",
  pickupLocation: "",
  itemDetails: "",
  studentName: "",
  studentPhone: "",
  dorm: "",
  room: "",
  instructions: "",
  acceptedTerms: false,
  paymentMethod: paymentMethods[0],
};
