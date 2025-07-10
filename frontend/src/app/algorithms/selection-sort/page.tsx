/**
 * src/app/algorithms/selection-sort/page.tsx
 *
 * 選択ソートアルゴリズムの解説ページ
 * インタラクティブな可視化と詳細解説を提供
 */

"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { AlgorithmVisualizer } from "../../../components/algorithm/AlgorithmVisualizer";
import { CalculationExplanation } from "../../../components/calculator/CalculationExplanation";
import { selectionSortExplanation } from "../../../data/explanations/selection-sort-explanation";
import type { AlgorithmInput, AlgorithmResult } from "../../../types/algorithm";
import { SelectionSortAlgorithm } from "../../../utils/algorithms/selection-sort";

/**
 * 選択ソート学習ページ
 * 可視化とインタラクティブな実行で理解を深める
 */
export default function SelectionSortPage() {
	// アルゴリズムインスタンス
	const algorithm = new SelectionSortAlgorithm();

	// 状態管理
	const [input, setInput] = useState<AlgorithmInput>(
		algorithm.getDefaultInput(),
	);
	const [result, setResult] = useState<AlgorithmResult | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [customArray, setCustomArray] = useState("");

	/**
	 * アルゴリズムを実行
	 */
	const executeAlgorithm = useCallback(() => {
		setIsExecuting(true);
		try {
			const executionResult = algorithm.execute(input);
			setResult(executionResult);
		} catch (error) {
			console.error("アルゴリズム実行エラー:", error);
			alert(
				error instanceof Error ? error.message : "実行中にエラーが発生しました",
			);
		} finally {
			setIsExecuting(false);
		}
	}, [algorithm, input]);

	/**
	 * ランダムな配列を生成
	 */
	const generateRandomArray = useCallback(() => {
		const size = Math.floor(Math.random() * 4) + 5; // 5-8個の要素
		const array = SelectionSortAlgorithm.generateRandomArray(size, 50);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * 逆順配列を生成（交換が最も多くなるケース）
	 */
	const generateReverseArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 5; // 5-7個の要素
		const array = SelectionSortAlgorithm.generateReverseArray(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * ソート済み配列を生成（交換が最も少なくなるケース）
	 */
	const generateSortedArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 5; // 5-7個の要素
		const array = SelectionSortAlgorithm.generateSortedArray(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * 重複要素を含む配列を生成（安定性の確認用）
	 */
	const generateDuplicateArray = useCallback(() => {
		const size = Math.floor(Math.random() * 3) + 6; // 6-8個の要素
		const array = SelectionSortAlgorithm.generateArrayWithDuplicates(size);

		setInput({ array });
		setCustomArray(array.join(", "));
		setResult(null);
	}, []);

	/**
	 * カスタム入力を適用
	 */
	const applyCustomInput = useCallback(() => {
		try {
			// 配列のパース
			const arrayStr = customArray.trim();
			if (!arrayStr) {
				alert("配列を入力してください");
				return;
			}

			const array = arrayStr.split(",").map((s) => {
				const num = Number(s.trim());
				if (Number.isNaN(num)) {
					throw new Error(`"${s.trim()}" は有効な数値ではありません`);
				}
				return num;
			});

			// 配列のサイズ制限
			if (array.length > 10) {
				alert("配列のサイズは10個以下にしてください（可視化のため）");
				return;
			}

			if (array.length < 2) {
				alert("配列には最低2個の要素が必要です");
				return;
			}

			setInput({ array });
			setResult(null);
		} catch (error) {
			alert(
				error instanceof Error ? error.message : "入力エラーが発生しました",
			);
		}
	}, [customArray]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* パンくずナビゲーション */}
				<nav className="mb-6" aria-label="パンくずナビゲーション">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<Link
							href="/algorithms"
							className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>戻る</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							アルゴリズム学習
						</Link>
						<span className="text-gray-400">／</span>
						<span className="text-gray-900 dark:text-gray-100 font-medium">
							選択ソート
						</span>
					</div>
				</nav>

				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						選択ソートアルゴリズム
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						未ソート部分から最小値を選択して先頭に移動する操作を繰り返すソートアルゴリズムを学ぼう
					</p>
				</header>

				{/* アルゴリズム情報カード */}
				<div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
					<div className="grid md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
								O(n²)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								時間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								O(1)
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								空間計算量
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600 dark:text-green-400">
								初級
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								難易度
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
								ソート
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								カテゴリ
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* 入力パネル */}
					<div className="xl:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
								🔧 実行設定
							</h3>

							{/* 現在の設定表示 */}
							<div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<div className="mb-2">
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										配列:
									</span>
									<div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-1">
										[{input.array.join(", ")}]
									</div>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
										要素数:
									</span>
									<div className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
										{input.array.length}
									</div>
								</div>
							</div>

							{/* カスタム入力 */}
							<div className="space-y-4 mb-6">
								<div>
									<label
										htmlFor="custom-array"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
									>
										配列（カンマ区切り、最大10個）
									</label>
									<input
										id="custom-array"
										type="text"
										value={customArray}
										onChange={(e) => setCustomArray(e.target.value)}
										placeholder="64, 25, 12, 22, 11"
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<button
									type="button"
									onClick={applyCustomInput}
									className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
								>
									適用
								</button>
							</div>

							{/* プリセットボタン */}
							<div className="space-y-2 mb-6">
								<button
									type="button"
									onClick={generateRandomArray}
									className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
								>
									🎲 ランダム配列
								</button>
								<button
									type="button"
									onClick={generateReverseArray}
									className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
								>
									📉 逆順配列（交換多）
								</button>
								<button
									type="button"
									onClick={generateSortedArray}
									className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
								>
									📈 ソート済み（交換少）
								</button>
								<button
									type="button"
									onClick={generateDuplicateArray}
									className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
								>
									🔄 重複要素（安定性確認）
								</button>
							</div>

							{/* 実行ボタン */}
							<button
								type="button"
								onClick={executeAlgorithm}
								disabled={isExecuting}
								className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
									isExecuting
										? "bg-gray-400 text-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isExecuting ? "実行中..." : "🎯 選択ソート実行"}
							</button>

							{/* 結果表示 */}
							{result && (
								<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
										実行結果
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												ソート結果:
											</span>
											<div className="font-mono text-sm text-green-600 dark:text-green-400 mt-1">
												[
												{Array.isArray(result.result)
													? result.result.join(", ")
													: result.result}
												]
											</div>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												実行ステップ数:
											</span>
											<span className="ml-2 font-mono font-bold text-gray-900 dark:text-gray-100">
												{result.executionSteps}
											</span>
										</div>
										<div>
											<span className="text-gray-600 dark:text-gray-400">
												時間計算量:
											</span>
											<span className="ml-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
												{result.timeComplexity}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 可視化エリア */}
					<div className="xl:col-span-2">
						{result ? (
							<AlgorithmVisualizer steps={result.steps} className="mb-8" />
						) : (
							<div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center mb-8">
								<div className="text-6xl mb-4">🎯</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
									アルゴリズムを実行してください
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									左側の設定パネルから条件を設定し、「選択ソート実行」ボタンを押してください
								</p>
							</div>
						)}
					</div>
				</div>

				{/* 詳細解説セクション */}
				<section className="mt-12">
					<CalculationExplanation
						explanationData={selectionSortExplanation}
						defaultExpanded={false}
						className="shadow-xl"
					/>
				</section>

				{/* コード例セクション */}
				<section className="mt-12">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							💻 実装例（JavaScript）
						</h3>
						<div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
							<pre className="text-sm text-gray-100">
								<code>{`function selectionSort(arr) {
    const n = arr.length;
    const sortedArray = [...arr]; // 元の配列を変更しない
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // 未ソート部分から最小値を探す
        for (let j = i + 1; j < n; j++) {
            if (sortedArray[j] < sortedArray[minIndex]) {
                minIndex = j;
            }
        }
        
        // 最小値を正しい位置に交換
        if (minIndex !== i) {
            [sortedArray[i], sortedArray[minIndex]] = 
                [sortedArray[minIndex], sortedArray[i]];
        }
    }
    
    return sortedArray;
}

// 使用例
const unsortedArray = [64, 25, 12, 22, 11];
const sortedArray = selectionSort(unsortedArray);
console.log(sortedArray); // [11, 12, 22, 25, 64]

// 交換回数を数える版
function selectionSortWithStats(arr) {
    const n = arr.length;
    const sortedArray = [...arr];
    let swapCount = 0;
    let comparisonCount = 0;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            comparisonCount++;
            if (sortedArray[j] < sortedArray[minIndex]) {
                minIndex = j;
            }
        }
        
        if (minIndex !== i) {
            [sortedArray[i], sortedArray[minIndex]] = 
                [sortedArray[minIndex], sortedArray[i]];
            swapCount++;
        }
    }
    
    return { 
        sorted: sortedArray, 
        swaps: swapCount, 
        comparisons: comparisonCount 
    };
}`}</code>
							</pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
