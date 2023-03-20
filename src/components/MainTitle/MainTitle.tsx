interface Props {
   content: string;
}

export default function MainTitle({ content }: Props) {
   return <h1 className="main-title">{content}</h1>;
}
