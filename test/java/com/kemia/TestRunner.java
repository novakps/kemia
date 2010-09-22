package com.kemia;

import com.thoughtworks.selenium.SeleneseTestCase;

public class TestRunner extends SeleneseTestCase {
	private final String DIRECTORY_PREFIX = "file:////Users/paulnovak/wingu/workspace/kemia/";

	public void setUp() throws Exception {
		setUp(DIRECTORY_PREFIX, "*firefox");
	}

	public void testGoogString() {
		selenium.open(DIRECTORY_PREFIX + "third-party/closure/closure/goog/string/string_test.html");
		selenium.waitForCondition("window.G_testRunner && window.G_testRunner.isFinished()", "5000");

		String success = selenium.getEval("window.G_testRunner.isSuccess()");

		boolean isSuccess = "true".equals(success);
		if (!isSuccess) {
			String report = selenium.getEval("window.G_testRunner.getReport()");
			fail(report);
		}
	}

//	public void testPlugin() {
//		helper("kemia/controller/plugin_test.html");
//	}

	public void testModel() {
		helper("kemia/model/model_test.html");
	}

//	public void testQuery() {
//		helper("kemia/query/query_test.html");
//	}

	public void testSymmetry() {
		helper("kemia/symmetry/symmetry_test.html");
	}

//	public void testReactionEditor() {
//		helper("kemia/controller/reaction_editor_test.html");
//	}

//	public void testAffineTransform() {
//		helper("kemia/graphics/affine_transform_test.html");
//	}

//	public void testSMILES() {
//		helper("kemia/io/smiles/smiles_parser_test.html");
//	}

	public void testJSON() {
		helper("kemia/io/json_test.html");
	}

//	public void testMdl() {
//		helper("kemia/io/mdl_test.html");
//	}

	public void testLine() {
		helper("kemia/math/line_test.html");
	}

//	public void testNeighborList() {
//		helper("kemia/model/neighborlist_test.html");
//	}
	
	public void testRing() {
		helper("kemia/ring/hanser_test.html");
		helper("kemia/ring/ring_finder_test.html");
		helper("kemia/ring/ring_partitioner_teset.html");
	}

//	public void testSssr() {
//		helper("kemia/ring/sssr_test.html");
//	}

	public void helper(String test_path) {
		selenium.open(DIRECTORY_PREFIX + test_path);
		selenium.waitForCondition("window.G_testRunner && window.G_testRunner.isFinished()", "5000");
		String success = selenium.getEval("window.G_testRunner.isSuccess()");
		boolean isSuccess = "true".equals(success);
		if (!isSuccess) {
			String report = selenium.getEval("window.G_testRunner.getReport()");
			fail(report);
		}
	}
}
