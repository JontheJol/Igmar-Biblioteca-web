// src/icons/EditIcon.tsx

const EditIcon = ({
  width = 24,
  height = 24,
  color = '#FFF9EC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <svg
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
  >
    <path
      d="M3 21L12 21L21 21"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 15L4 20L9 19L20.385 7.615C20.7788 7.22123 21.0001 6.68718 21.0001 6.13C21.0001 5.57281 20.7788 5.03876 20.385 4.645L19.355 3.615C18.9612 3.22123 18.4272 2.99988 17.87 2.99988C17.3128 2.99988 16.7788 3.22123 16.385 3.615L5 15Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 6L18 9"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditIcon;