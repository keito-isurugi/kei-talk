/**
 * src/app/algorithms/page.tsx
 *
 * アルゴリズム学習のメインページ
 * 利用可能なアルゴリズム一覧と学習ガイドを提供
 */

"use client";

import Link from "next/link";
import React from "react";
import type { AlgorithmInfo } from "../../types/algorithm";

/**
 * アルゴリズム学習メインページ
 * 各アルゴリズムへのナビゲーションと概要を提供
 */
export default function AlgorithmsPage() {
	// 利用可能なアルゴリズム一覧
	const availableAlgorithms: AlgorithmInfo[] = [
		{
			id: "binary-search",
			name: "二分探索",
			description: "ソート済み配列から効率的に要素を検索する基本アルゴリズム",
			category: "search",
			timeComplexity: {
				best: "O(1)",
				average: "O(log n)",
				worst: "O(log n)",
			},
			spaceComplexity: "O(1)",
			difficulty: 2,
		},
		{
			id: "bubble-sort",
			name: "バブルソート",
			description:
				"隣接する要素を比較して交換を繰り返すシンプルなソートアルゴリズム",
			category: "sort",
			timeComplexity: {
				best: "O(n)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			spaceComplexity: "O(1)",
			difficulty: 2,
		},
		// 将来追加予定のアルゴリズム
		// {
		// 	id: "quick-sort",
		// 	name: "クイックソート",
		// 	description: "分割統治法による効率的なソートアルゴリズム",
		// 	category: "sort",
		// 	timeComplexity: {
		// 		best: "O(n log n)",
		// 		average: "O(n log n)",
		// 		worst: "O(n²)",
		// 	},
		// 	spaceComplexity: "O(log n)",
		// 	difficulty: 3,
		// },
	];

	/**
	 * 難易度レベルを星で表示
	 */
	const getDifficultyStars = (difficulty: number): string => {
		return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
	};

	/**
	 * カテゴリの日本語名を取得
	 */
	const getCategoryName = (category: string): string => {
		const categoryMap: Record<string, string> = {
			search: "探索",
			sort: "ソート",
			graph: "グラフ",
			dynamic: "動的プログラミング",
			greedy: "貪欲法",
			divide: "分割統治",
			string: "文字列",
			tree: "木構造",
			other: "その他",
		};
		return categoryMap[category] || category;
	};

	/**
	 * カテゴリの色を取得
	 */
	const getCategoryColor = (category: string): string => {
		const colorMap: Record<string, string> = {
			search:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
			sort: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			graph:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
			dynamic: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
			greedy:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
			divide:
				"bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
			string:
				"bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
			tree: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
			other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
		};
		return colorMap[category] || colorMap.other;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-12 text-center">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 dark:from-purple-400 dark:via-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-4">
						アルゴリズム学習
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
						視覚化とインタラクティブな実行で、アルゴリズムの動作原理を直感的に理解しよう
					</p>

					{/* 学習の特徴 */}
					<div className="grid md:grid-cols-3 gap-6 mt-8">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
							<div className="text-3xl mb-3">👁️</div>
							<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
								視覚化学習
							</h3>
							<p className="text-blue-700 dark:text-blue-300 text-sm">
								アルゴリズムの各ステップを目で見て理解
							</p>
						</div>
						<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
							<div className="text-3xl mb-3">🎮</div>
							<h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
								インタラクティブ
							</h3>
							<p className="text-green-700 dark:text-green-300 text-sm">
								自分のペースでステップ実行できる
							</p>
						</div>
						<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
							<div className="text-3xl mb-3">📚</div>
							<h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
								詳細解説
							</h3>
							<p className="text-purple-700 dark:text-purple-300 text-sm">
								理論から実装まで包括的に学習
							</p>
						</div>
					</div>
				</header>

				{/* アルゴリズム一覧 */}
				<section className="mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						📖 学習可能なアルゴリズム
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{availableAlgorithms.map((algorithm) => (
							<Link
								key={algorithm.id}
								href={`/algorithms/${algorithm.id}`}
								className="group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
									{/* アルゴリズム名とカテゴリ */}
									<div className="flex items-start justify-between mb-4">
										<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
											{algorithm.name}
										</h3>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(algorithm.category)}`}
										>
											{getCategoryName(algorithm.category)}
										</span>
									</div>

									{/* 説明 */}
									<p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
										{algorithm.description}
									</p>

									{/* 計算量情報 */}
									<div className="space-y-2 mb-4">
										<div className="flex justify-between text-sm">
											<span className="text-gray-500 dark:text-gray-500">
												時間計算量:
											</span>
											<span className="font-mono font-medium text-gray-900 dark:text-gray-100">
												{algorithm.timeComplexity.average}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-500 dark:text-gray-500">
												空間計算量:
											</span>
											<span className="font-mono font-medium text-gray-900 dark:text-gray-100">
												{algorithm.spaceComplexity}
											</span>
										</div>
									</div>

									{/* 難易度 */}
									<div className="flex items-center justify-between">
										<div className="text-sm">
											<span className="text-gray-500 dark:text-gray-500">
												難易度:
											</span>
											<span className="ml-2 text-yellow-500">
												{getDifficultyStars(algorithm.difficulty)}
											</span>
										</div>
										<div className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
											→
										</div>
									</div>
								</div>
							</Link>
						))}

						{/* 準備中カード */}
						<div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
							<div className="text-4xl mb-3">🚧</div>
							<h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">
								さらなるアルゴリズム
							</h3>
							<p className="text-gray-500 dark:text-gray-500 text-sm">
								クイックソート、マージソート
								<br />
								DFS、BFSなどを準備中...
							</p>
						</div>
					</div>
				</section>

				{/* 学習ガイド */}
				<section className="mb-12">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
						<h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 text-center">
							🎯 効果的な学習方法
						</h2>

						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									📋 学習の流れ
								</h3>
								<ol className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>1. まず解説を読んで基本概念を理解</li>
									<li>2. 可視化でアルゴリズムの動作を観察</li>
									<li>3. 様々なケースで実際に実行してみる</li>
									<li>4. コード例を見て実装方法を学習</li>
									<li>5. 他のアルゴリズムとの比較検討</li>
								</ol>
							</div>

							<div>
								<h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
									💡 学習のコツ
								</h3>
								<ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
									<li>• 自分でケースを作って試してみる</li>
									<li>• 最悪ケース・最良ケースを意識する</li>
									<li>• 実生活の例と関連付けて理解する</li>
									<li>• 時間計算量の意味を具体的に考える</li>
									<li>• 他の人に説明できるまで理解を深める</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* フッター情報 */}
				<footer className="text-center text-gray-600 dark:text-gray-400">
					<p className="text-sm">
						🚀
						より多くのアルゴリズムを順次追加予定です。リクエストがあればお気軽にお声がけください！
					</p>
				</footer>
			</div>
		</div>
	);
}
