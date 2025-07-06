import type React from "react";
import type { Gender } from "../../types/big3";
import { getWeightRangeMessageByGender } from "../../utils/big3-calculator-gender";

interface WeightInputProps {
	/** 体重の値 (kg) */
	value: number | "";
	/** 値が変更された時のコールバック */
	onChange: (value: number | "") => void;
	/** 性別 */
	gender: Gender;
	/** エラーメッセージ */
	errorMessage?: string;
	/** 無効化フラグ */
	disabled?: boolean;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * 体重入力コンポーネント
 * 数値のみの入力を受け付け、バリデーションエラーを表示する
 */
export const WeightInput: React.FC<WeightInputProps> = ({
	value,
	onChange,
	gender,
	errorMessage,
	disabled = false,
	className = "",
}) => {
	/**
	 * 入力値の変更処理
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		// 空文字の場合
		if (inputValue === "") {
			onChange("");
			return;
		}

		// 数値に変換を試行
		const numericValue = Number.parseFloat(inputValue);

		// 有効な数値の場合
		if (!Number.isNaN(numericValue)) {
			onChange(numericValue);
		} else {
			// 無効な入力の場合は空文字にする
			onChange("");
		}
	};

	const hasError = !!errorMessage;
	const inputValue = value === "" ? "" : value.toString();

	return (
		<div className={`space-y-3 ${className}`}>
			{/* ラベル */}
			<label
				htmlFor="bodyWeight"
				className="flex text-sm font-semibold text-foreground items-center gap-2"
			>
				<span className="text-lg">⚖️</span>
				体重 <span className="text-error-500">*</span>
			</label>

			{/* 入力フィールド */}
			<div className="relative">
				<input
					type="number"
					id="bodyWeight"
					value={inputValue}
					onChange={handleChange}
					disabled={disabled}
					placeholder="例: 70"
					min="0"
					step="0.1"
					className={`
						input pr-12 text-lg font-medium
						${
							hasError
								? "border-error-500 focus-visible:ring-error-500 bg-error-50 dark:bg-error-950/20"
								: "border-border focus-visible:ring-primary"
						}
						${
							disabled
								? "bg-secondary/50 cursor-not-allowed text-muted-foreground"
								: "bg-background text-foreground"
						}
					`}
					aria-invalid={hasError}
					aria-describedby={hasError ? "bodyWeight-error" : undefined}
				/>

				{/* 単位表示 */}
				<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
					<span
						className={`text-sm font-bold px-2 py-1 rounded-md ${
							disabled
								? "text-muted-foreground bg-secondary/30"
								: "text-primary bg-primary-50 dark:bg-primary-950/30"
						}`}
					>
						kg
					</span>
				</div>
			</div>

			{/* エラーメッセージ */}
			{hasError && (
				<div className="flex items-center gap-2 p-3 bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-800 rounded-lg">
					<span className="text-error-500">⚠️</span>
					<output
						id="bodyWeight-error"
						className="text-sm text-error-600 dark:text-error-400 font-medium"
					>
						{errorMessage}
					</output>
				</div>
			)}

			{/* ヘルプテキスト */}
			{!hasError && (
				<div className="flex items-center gap-2 p-3 bg-secondary-50 dark:bg-secondary-950/20 border border-secondary-200 dark:border-secondary-800 rounded-lg">
					<span className="text-secondary-500">💡</span>
					<p className="text-sm text-muted-foreground">
						{getWeightRangeMessageByGender(gender)}
					</p>
				</div>
			)}
		</div>
	);
};
