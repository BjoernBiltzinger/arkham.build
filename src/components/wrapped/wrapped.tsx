import { Loader } from "@/components/ui/loader";
import css from "@/components/wrapped/wrapped.module.css";
import { AppLayout } from "@/layouts/app-layout";
import { cx } from "@/utils/cx";
import { Suspense, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import WrappedChartCollection from "./wrappedChartCollection";
import { DeckFilter } from "./wrappedDeckFilter";

export default function WrappedChartContainer() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [onlyValid, setOnlyValid] = useState<boolean>(true);
  console.log("onlyValid", onlyValid);
  return (
    <AppLayout title={t("settings.title")}>
      <article className={cx(css["wrapped"])} ref={ref}>
        <div className={css["wrapped-title-box"]}>
          <div className={css["wrapped-title"]}>
            {"Welcome to your personalized deck statistics!"}
            <DeckFilter onFilterChange={setOnlyValid} value={onlyValid} />
          </div>
        </div>
        <Suspense fallback={<Loader show message={t("deck.tools.loading")} />}>
          <WrappedChartCollection onlyValid={onlyValid} />
        </Suspense>
      </article>
    </AppLayout>
  );
}
