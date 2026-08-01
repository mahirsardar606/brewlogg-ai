import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Batch, Profile } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#D97706",
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D97706",
  },
  subtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  breweryName: {
    fontSize: 13,
    marginTop: 8,
    color: "#1F2937",
  },
  dateRange: {
    fontSize: 10,
    color: "#374151",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#D97706",
    paddingBottom: 6,
    marginBottom: 6,
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 6,
    fontSize: 9,
    color: "#374151",
  },
  colDate: { width: "18%" },
  colBeer: { width: "28%" },
  colBatch: { width: "12%" },
  colOG: { width: "14%", textAlign: "right" },
  colFG: { width: "14%", textAlign: "right" },
  colABV: { width: "14%", textAlign: "right" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  noData: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 12,
  },
});

interface BatchSummaryPDFProps {
  batches: Batch[];
  profile: Profile;
  startDate: string | null;
  endDate: string | null;
}

export function BatchSummaryPDF({
  batches,
  profile,
  startDate,
  endDate,
}: BatchSummaryPDFProps) {
  const totalBatches = batches.length;
  const avgAbv =
    batches.filter((b) => b.abv).length > 0
      ? (
          batches
            .filter((b) => b.abv)
            .reduce((sum, b) => sum + (b.abv ?? 0), 0) /
          batches.filter((b) => b.abv).length
        ).toFixed(1)
      : "—";

  const dateRangeText =
    startDate && endDate
      ? `${new Date(startDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })} – ${new Date(endDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`
      : startDate
        ? `From ${new Date(startDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`
        : endDate
          ? `Until ${new Date(endDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`
          : "All time";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>🍺 BrewLog.ai</Text>
          <Text style={styles.subtitle}>Batch Summary Report</Text>
          {profile.brewery_name && (
            <Text style={styles.breweryName}>{profile.brewery_name}</Text>
          )}
          <Text style={styles.dateRange}>{dateRangeText}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Batches</Text>
            <Text style={styles.summaryValue}>{totalBatches}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Avg ABV</Text>
            <Text style={styles.summaryValue}>
              {avgAbv === "—" ? "—" : `${avgAbv}%`}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Date Range</Text>
            <Text style={[styles.summaryValue, { fontSize: 9 }]}>
              {batches.length > 0
                ? `${new Date(
                    batches[batches.length - 1].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} – ${new Date(
                    batches[0].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "N/A"}
            </Text>
          </View>
        </View>

        {batches.length > 0 ? (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.colDate}>Date</Text>
              <Text style={styles.colBeer}>Beer Name</Text>
              <Text style={styles.colBatch}>Batch #</Text>
              <Text style={styles.colOG}>OG</Text>
              <Text style={styles.colFG}>FG</Text>
              <Text style={styles.colABV}>ABV</Text>
            </View>

            {batches.map((batch) => (
              <View style={styles.tableRow} key={batch.id}>
                <Text style={styles.colDate}>
                  {new Date(batch.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.colBeer}>{batch.beer_name}</Text>
                <Text style={styles.colBatch}>{batch.batch_number}</Text>
                <Text style={styles.colOG}>{batch.og ?? "—"}</Text>
                <Text style={styles.colFG}>{batch.fg ?? "—"}</Text>
                <Text style={styles.colABV}>
                  {batch.abv ? `${batch.abv}%` : "—"}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noData}>No batches found in this date range.</Text>
        )}

        <Text style={styles.footer}>
          Generated by BrewLog.ai on{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Page>
    </Document>
  );
}
