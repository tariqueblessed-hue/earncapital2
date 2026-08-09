import type { Metadata } from "next";
import "./globals.css";
import { EarnCapitalPopupProvider } from "@/components/notifications/EarnCapitalPopup";

export const metadata: Metadata = {
title: {
default: "EarnCapital",
template: "%s | EarnCapital",
},
description:
"EarnCapital — complete tasks, earn rewards, build your balance and grow with referrals.",
keywords: [
"EarnCapital",
"earn money online",
"online tasks",
"rewards",
"referrals",
],
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
<body>
<EarnCapitalPopupProvider>
{children}
</EarnCapitalPopupProvider>
</body>
</html>
);
}