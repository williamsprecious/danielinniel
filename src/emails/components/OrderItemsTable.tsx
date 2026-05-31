/**
 * Reusable line-item list + totals summary, shared by the customer order
 * confirmation and the admin notification. Named export only.
 *
 * Layout uses `Row`/`Column` (table-based) — never flex/grid/float — for
 * email-client compatibility. Thumbnails are forced to PNG so Sanity never
 * serves WEBP. Line items sit in a white block; totals in a soft-grey panel.
 */
import { Column, Hr, Img, Row, Section, Text } from "react-email";
import { emailImageUrl } from "../lib/image";
import { brand } from "../theme";
import { Block, Panel, SectionTitle } from "./parts";
import { formatNGN, type EmailOrderItem } from "../types";

const thumbUrl = (assetRef: string): string =>
  emailImageUrl({
    _type: "image",
    asset: { _type: "reference", _ref: assetRef },
  })
    .width(140)
    .height(140)
    .fit("crop")
    .format("png")
    .url();

function SummaryRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <Row width="100%">
      <Column className="w-full py-[7px]">
        <Text
          className={
            emphasize
              ? "m-0 text-[15px] font-bold"
              : "m-0 text-[14px] font-medium"
          }
          style={{ color: emphasize ? brand.heading : brand.body }}
        >
          {label}
        </Text>
      </Column>
      <Column
        align="right"
        className="py-[7px]"
        style={{ whiteSpace: "nowrap" }}
      >
        <Text
          className={
            emphasize
              ? "m-0 text-[18px] font-bold"
              : "m-0 text-[14px] font-medium"
          }
          style={{ color: brand.heading }}
        >
          {value}
        </Text>
      </Column>
    </Row>
  );
}

export function OrderItemsTable({
  items,
  subtotalNGN,
  shippingFeeNGN,
  totalNGN,
  showShipping = true,
}: {
  items: EmailOrderItem[];
  subtotalNGN: number;
  shippingFeeNGN: number;
  totalNGN: number;
  /** Hide the shipping row for digital-only orders. */
  showShipping?: boolean;
}) {
  return (
    <Section>
      {/* Line items — white block */}
      <Block>
        <SectionTitle>Order summary</SectionTitle>
        {items.map((item, i) => (
          <Section key={i}>
            {i > 0 ? (
              <Hr className="my-[18px]" style={{ borderColor: brand.line }} />
            ) : null}
            <Row width="100%">
              <Column className="w-[72px]" valign="top">
                {item.imageUrl || item.imageAssetRef ? (
                  <Img
                    src={item.imageUrl || thumbUrl(item.imageAssetRef!)}
                    alt={item.title}
                    width="60"
                    height="60"
                    className="block"
                    style={{ border: `1px solid ${brand.line}` }}
                  />
                ) : (
                  <Section
                    className="h-[60px] w-[60px] text-center"
                    style={{
                      backgroundColor: brand.panel,
                      border: `1px solid ${brand.line}`,
                    }}
                  >
                    <Text
                      className="m-0 mt-[21px] text-[9px] font-bold uppercase"
                      style={{ letterSpacing: "1px", color: brand.muted }}
                    >
                      {item.type === "digital" ? "DIG" : "IMG"}
                    </Text>
                  </Section>
                )}
              </Column>

              <Column valign="top" className="w-full pl-[16px]">
                <Text
                  className="m-0 text-[14px] font-bold leading-[20px]"
                  style={{ color: brand.heading }}
                >
                  {item.title}
                </Text>
                {item.variantTitle ? (
                  <Text
                    className="m-0 mt-[3px] text-[13px] font-medium leading-[18px]"
                    style={{ color: brand.body }}
                  >
                    {item.variantTitle}
                  </Text>
                ) : null}
                <Text
                  className="m-0 mt-[5px] text-[12px] font-medium leading-[16px]"
                  style={{ color: brand.muted }}
                >
                  {item.type === "digital" ? "Digital" : "Physical"} · Qty{" "}
                  {item.qty} × {formatNGN(item.unitPriceNGN)}
                </Text>
              </Column>

              <Column
                valign="top"
                align="right"
                className="w-[92px]"
                style={{ whiteSpace: "nowrap" }}
              >
                <Text
                  className="m-0 text-[15px] font-bold"
                  style={{ color: brand.heading }}
                >
                  {formatNGN(item.lineTotalNGN)}
                </Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Block>

      <Hr className="m-0" style={{ borderColor: brand.line }} />

      {/* Totals — soft-grey panel */}
      <Panel>
        <SummaryRow label="Subtotal" value={formatNGN(subtotalNGN)} />
        {showShipping ? (
          <SummaryRow
            label="Shipping"
            value={shippingFeeNGN > 0 ? formatNGN(shippingFeeNGN) : "Free"}
          />
        ) : null}
        <Hr className="my-[8px]" style={{ borderColor: brand.line }} />
        <SummaryRow label="Total" value={formatNGN(totalNGN)} emphasize />
      </Panel>
    </Section>
  );
}
