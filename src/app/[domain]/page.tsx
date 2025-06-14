import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor-navigation";
import FunnelEditor from "../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

const Page = async ({ params }: { params: { domain: string } }) => {
  console.log("1");
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound();
  console.log("2");
  const pageData = domainData.FunnelPages.find((page) => !page.pathName);
  console.log("3");

  if (!pageData) return notFound();

  console.log("4");
  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  console.log("5");
  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
