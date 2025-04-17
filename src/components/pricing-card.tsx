import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { PaymentButton } from "./payment-button";
import { Button } from "./ui/button";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  items: string[];
}

export const PricingCard = ({
  title,
  description,
  price,
  items = [],
}: PricingCardProps) => {
  return (
    <Card className="w-[350px] text-left md:mt-10 mt-5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold mb-8 mt-4">
          {price}
          <span className="font-normal text-muted-foreground text-lg">
            /mês
          </span>{" "}
        </p>
        <ul>
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-muted-foreground">
              <Check className="w-4 text-green-600" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {/* <PaymentButton>Assine agora</PaymentButton> */}
        <Button asChild className="w-full">
          <Link href="/sign-up">Experimente Grátis</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
